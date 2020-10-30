module.exports = function(io, app, connection){
    //문의 전용 방
    app.get('/inquiry/:meeting_id', (req, res)=> {
        var meeting_id = req.params.meeting_id;
        if(req.session.logined){
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
                    //존재하는 모임일 경우
                    if(rows[0].success){
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
            
                                var is_member_sql = 'select EXISTS (select * from meeting_participants where fk_participant_id = ? and fk_meeting_id=?) as success';
                                connection.query(is_member_sql, [user_id, meeting_id], (err, is_member, fields)=>{
                                    if(err){
                                        console.log(err);
                                        res.json({
                                            'state':500,
                                            'message':'서버 에러'
                                        });
                                    }
                                    else{
                                        io.once('connection', (socket) => {
                                            socket.name = user_nick_name;
                                            console.log('user connected');
            
                                            
                                            //socket 연결 해제
                                            socket.on('disconnect', () => {
                                                console.log('user ' + socket.name +  ' leaved');
                                                socket.leave(0);
                                            });
                                            
                                            //메시지 전송
                                            socket.on('send message', (meeting_id, user_nick_name, text) => {
                                                var chat = {
                                                    'meeting_id': meeting_id,
                                                    'user_nick_name':user_nick_name,
                                                    'message': text,
                                                    'room' : 0
                                                }
                                                var insert_sql = 'insert into chat set ?;'
                                                connection.query(insert_sql, chat, (err, rows, fields)=>{
                                                    if(err){
                                                        console.log(err);
                                                        // res.json({
                                                        //     'state':500,
                                                        //     'mesaage':'서버 에러'
                                                        // });
                                                    }
                                                    else{
                                                        var select_sql = "select user_nick_name, message, date_format(created, '%Y-%m-%d') as created from chat where meeting_id=? and room=0 and user_nick_name=? order by chat_id desc limit 1";
                                                        connection.query(select_sql, [meeting_id, user_nick_name], (err, rows, fields) => {
                                                            if(err){
                                                                console.log(err);
                                                                // res.json({
                                                                //     'state':500,
                                                                //     'message':'서버 에러'
                                                                // });
                                                            }
                                                            else{
                                                                var msg = JSON.stringify(rows[0]);
                                                                socket.name = user_nick_name;
                                                                io.to(0).emit('receive message', msg);
                                                            }
                                                        });
                                                    }
                                                });
                                            });
            
                                            if(is_member[0].success){
                                                //멤버일 경우 -> 모임장인지 확인
                                                var is_captain_sql = 'select fk_captain_id from meeting where meeting_id=?';
                                                connection.query(is_captain_sql, [meeting_id], (err, rows, fields) => {
                                                    if(err){
                                                        console.log(err);
                                                        // res.json({
                                                        //     'state':500,
                                                        //     'message':'서버 에러'
                                                        // });
                                                    }
                                                    else{
                                                        //모임장일 경우
                                                        var chat_sql = "select user_nick_name, message, date_format(created, '%Y-%m-%d') as created from chat where meeting_id=? and room=?";
                                                        connection.query(chat_sql, [meeting_id, 0], (err, rows, fields) => {
                                                            if(err){
                                                                console.log(err);
                                                                // res.json({
                                                                //     'state':500,
                                                                //     'message':'서버 에러'
                                                                // });
                                                            }
                                                            else{
                                                                var chats = (rows.length > 0) ? JSON.stringify(rows) : '';
                                                                socket.join(0);
                                                                io.to(0).emit('new user', chats, user_nick_name, 0);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            else{
                                                //모임원 아닌 경우
                                                //채팅방 있는지 확인
                                                var select_sql = 'select EXISTS (select * from chatroom where user_nick_name=? and meeting_id=? and is_member=?) as success';
                                                connection.query(select_sql, [user_nick_name, meeting_id, 0], (err, rows, fields) => {
                                                    if(err){
                                                        console.log(err);
                                                        // res.json({
                                                        //     'state':500,
                                                        //     'message':'서버 에러'
                                                        // });
                                                    }
                                                    else{
                                                        if(rows[0].success){
                                                            //채팅방 속해있는 경우
                                                            var chat_sql = "select chat.user_nick_name, chat.message, date_format(chat.created, '%Y-%m-%d') as created from chat left join chatroom on chat.meeting_id = chatroom.meeting_id where chat.created > chatroom.created and chatroom.meeting_id=? and chatroom.room=? and chatroom.user_nick_name=?";
                                                            connection.query(chat_sql, [meeting_id, 0, user_nick_name], (err, rows, fields)=>{
                                                                if(err){
                                                                    console.log(err);
                                                                    // res.json({
                                                                    //     'state':500,
                                                                    //     'mesaage':'서버 에러'
                                                                    // });
                                                                }
                                                                else{
                                                                    //채팅방 입장
                                                                    var chats = (rows.length > 0) ? JSON.stringify(rows) : '';
                                                                    socket.join(0);
                                                                    io.to(0).emit('new user', chats, user_nick_name, 0);
                                                                }
                                                            });
                                                        }
                                                        else{
                                                            //속해있지 않은 경우 채팅방 생성
                                                            var meeting_name_sql = 'select meeting_name from meeting where meeting_id=?';
                                                            connection.query(meeting_name_sql, [meeting_id], (err, rows, fields)=>{
                                                                if(err){
                                                                    console.log(err);
                                                                    // res.json({
                                                                    //     'state':500,
                                                                    //     'mesaage':'서버 에러'
                                                                    // });
                                                                }
                                                                else{
                                                                    var meeting_name = rows[0].meeting_name;
                                                                    var insert_chatroom_sql = 'insert into chatroom (meeting_id, meeting_name, user_nick_name, is_member, room) values (?, ?, ?, ?, ?)';
                                                                    connection.query(insert_chatroom_sql, [meeting_id, meeting_name, user_nick_name, 0, 0], (err, rows, fields)=>{
                                                                        if(err){
                                                                            console.log(err);
                                                                            // res.json({
                                                                            //     'state':500,
                                                                            //     'mesaage':'서버 에러'
                                                                            // });
                                                                        }
                                                                        else{
                                                                            //채팅방 입장
                                                                            var chats = user_nick_name + ' 님이 문의하러 들어왔습니다.\n';
                                                                            socket.join(0);
                                                                            io.to(0).emit('new user', chats, user_nick_name, 0);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                        res.render('chat', {meeting_id : meeting_id});
                                    }
                                });
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
        else{
            res.json({
                'state':300,
                'message':'로그아웃 상태'
            });
        }
    });
}