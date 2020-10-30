module.exports = function(io, app, connection){
    //모임원들이 사용하는 채팅방
    app.get('/chat/:meeting_id', (req, res)=> {
        var meeting_id = req.params.meeting_id;
        if(req.session.logined){
            var user_email = req.session.user_email;
            var select_sql = 'select user_id, user_nick_name from users where user_email=?';
            connection.query(select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    res.json({
                        'state': 500,
                        'message': '서버 에러'
                    });
                }
                else{
                    var user_id = rows[0].user_id;
                    var user_nick_name = rows[0].user_nick_name;

                    var select_sql = 'select EXISTS (select * from meeting where meeting_id=?) as success';
                    connection.query(select_sql, [meeting_id], (err, rows, fields) => {
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows[0].success){
                                var is_member_sql = 'select EXISTS (select * from meeting_participants where fk_participant_id = ? and fk_meeting_id=?) as success';
                                connection.query(is_member_sql, [user_id, meeting_id], (err, rows, fields)=>{
                                    if(err){
                                        console.log(err);
                                        res.json({
                                            'state':500,
                                            'message':'서버 에러'
                                        });
                                    }
                                    else{
                                        if(rows[0].success){
                                            //채팅방 접속
                                            io.once('connection', (socket) => {
                                                socket.name = user_nick_name;
                                                console.log('socket ' + socket.name + ' connected');

                                                //채팅방에 속해있는지 확인
                                                var select_sql = 'select EXISTS (select * from chatroom where user_nick_name=? and meeting_id=? and is_member=1 and room=?) as success';
                                                connection.query(select_sql, [user_nick_name, meeting_id, meeting_id], (err, exists, fields)=>{
                                                    if(err){
                                                        console.log(err);
                                                        res.json({
                                                            'state':500,
                                                            'mesaage':'서버 에러'
                                                        });
                                                    }
                                                    else{
                                                        if(exists[0].success){
                                                            var chat_sql = "select chat.user_nick_name, chat.message, date_format(chat.created, '%Y-%m-%d') as created from chat left join chatroom on chat.room= chatroom.room where chat.created > chatroom.created and chatroom.meeting_id=? and chatroom.room=? and chatroom.user_nick_name=?";
                                                            connection.query(chat_sql, [meeting_id, meeting_id, user_nick_name], (err, rows, fields)=>{
                                                                if(err){
                                                                    console.log(err);
                                                                    res.json({
                                                                        'state':500,
                                                                        'mesaage':'서버 에러'
                                                                    });
                                                                }
                                                                else{
                                                                    var chats = (rows.length > 0) ? JSON.stringify(rows) : '';
                                                                    socket.join(meeting_id);
                                                                    io.to(meeting_id).emit('new user', chats, user_nick_name);
                                                                }
                                                            });
                                                        }
                                                        else{
                                                            var meeting_name_sql = 'select meeting_name from meeting where meeting_id=?';
                                                            connection.query(meeting_name_sql, [meeting_id], (err, rows, fields)=>{
                                                                if(err){
                                                                    console.log(err);
                                                                    res.json({
                                                                        'state':500,
                                                                        'mesaage':'서버 에러'
                                                                    });
                                                                }
                                                                else{
                                                                    //채팅방에 속하지 않은 멤버 채팅방 table에 추가
                                                                    var meeting_name = rows[0].meeting_name;
                                                                    var insert_chatroom_sql = 'insert into chatroom (meeting_id, meeting_name, user_nick_name, is_member, room) values (?, ?, ?, ?, ?)';
                                                                    connection.query(insert_chatroom_sql, [meeting_id, meeting_name, user_nick_name, 1, meeting_id], (err, rows, fields)=>{
                                                                        if(err){
                                                                            console.log(err);
                                                                            res.json({
                                                                                'state':500,
                                                                                'mesaage':'서버 에러'
                                                                            });
                                                                        }
                                                                        else{
                                                                            var chats= '새로운 멤버 ' + user_nick_name + ' 님이 입장했습니다.\n';
                                                                            socket.join(meeting_id);
                                                                            io.to(meeting_id).emit('new user', chats, user_nick_name);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                                
                                                //socket 연결 해제
                                                socket.on('disconnect', () => {
                                                    console.log('user ' + socket.name +  ' leaved');
                                                    socket.leave(meeting_id);
                                                });
                                              
                                                //메시지 전송
                                                socket.on('send message', (meeting_id, user_nick_name, text) => {
                                                    var chat = {
                                                        'meeting_id': meeting_id,
                                                        'user_nick_name':user_nick_name,
                                                        'message': text,
                                                        'room' : meeting_id
                                                    }
                                                    var insert_sql = 'insert into chat set ?;'
                                                    connection.query(insert_sql, chat, (err, rows, fields)=>{
                                                        if(err){
                                                            console.log(err);
                                                            res.json({
                                                                'state':500,
                                                                'mesaage':'서버 에러'
                                                            });
                                                        }
                                                        else{
                                                            var select_sql = "select user_nick_name, message, date_format(created, '%Y-%m-%d') as created from chat where meeting_id=? and room=? and user_nick_name=? order by chat_id desc limit 1";
                                                            connection.query(select_sql, [meeting_id, meeting_id, user_nick_name], (err, rows, fields) => {
                                                                if(err){
                                                                    console.log(err);
                                                                    res.json({
                                                                        'state':500,
                                                                        'message':'서버 에러'
                                                                    });
                                                                }
                                                                else{
                                                                    var msg = JSON.stringify(rows[0]);
                                                                    socket.name = user_nick_name;
                                                                    io.to(meeting_id).emit('receive message', msg);
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            });
                                            res.render('chat', {meeting_id : meeting_id});
                                        }
                                        else{
                                            res.json({
                                                'state':401,
                                                'message':'권한 없음'
                                            });
                                        }
                                    }
                                });
                            }
                            else{
                                res.json({
                                    'state':404,
                                    'message':'존재하지 않는 채팅방'
                                });
                            }
                        }
                    });
                }
            });
        }
        else{
            res.json({
                'state':300,
                'message':'로그아웃 상태'
            });
        }
      });
}