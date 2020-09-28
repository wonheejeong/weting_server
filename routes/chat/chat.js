module.exports = function(io, app, connection){
    app.get('/chat/:meetingId', (req, res)=> {
        var meetingId = req.params.meetingId;
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
                    var is_member_sql = 'select EXISTS (select * from meeting_participants where fk_participant_id = ? and fk_meeting_id=?) as success';
                    connection.query(is_member_sql, [user_id, meetingId], (err, rows, fields)=>{
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
                                    logined_ids[user_nick_name] = socket.id;
                                    console.log('user connected');
                                    
                                    //채팅방에 속해있는지 확인
                                    var select_sql = 'select EXISTS (select * from chatroom where user_nick_name=? and meeting_id=?) as success';
                                    connection.query(select_sql, [user_nick_name, meetingId], (err, exists, fields)=>{
                                        if(err){
                                            console.log(err);
                                            res.json({
                                                'state':500,
                                                'mesaage':'서버 에러'
                                            });
                                        }
                                        else{
                                            if(exists[0].success){
                                                var chat_sql = "select user_nick_name, message, date_format(created, '%Y-%m-%d') as created from chat where meeting_id=?";
                                                connection.query(chat_sql, [meetingId], (err, rows, fields)=>{
                                                    if(err){
                                                        console.log(err);
                                                        res.json({
                                                            'state':500,
                                                            'mesaage':'서버 에러'
                                                        });
                                                    }
                                                    else{
                                                        var chats = rows;
                                                        socket.join(meetingId);
                                                        io.to(meetingId).emit('new user', JSON.stringify(chats), user_nick_name);
                                                    }
                                                });
                                            }
                                            else{
                                                var meeting_name_sql = 'select meeting_name from meeting where meeting_id=?';
                                                connection.query(meeting_name_sql, [meetingId], (err, rows, fields)=>{
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
                                                        var insert_chatroom_sql = 'insert into chatroom (meeting_id, meeting_name, user_nick_name) values (?, ?, ?)';
                                                        connection.query(insert_chatroom_sql, [meetingId, meeting_name, user_nick_name], (err, rows, fields)=>{
                                                            if(err){
                                                                console.log(err);
                                                            }
                                                            else{
                                                                var chats= '새로운 멤버 ' + user_nick_name + ' 님이 참가했습니다.\n';
                                                                socket.join(meetingId);
                                                                io.to(meetingId).emit('new user', chats, user_nick_name);
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
                                        socket.leave(meetingId);
                                    });
                                  
                                    //메시지 전달
                                    socket.on('send message', (meetingId, user_nick_name, text) => {
                                        var chat = {
                                            'meeting_id': meetingId,
                                            'user_nick_name':user_nick_name,
                                            'message': text
                                        }
                                        var insert_sql = 'insert into chat set ?;'
                                        connection.query(insert_sql, chat, (err, rows, fields)=>{
                                            if(err){
                                                console.log(err);
                                            }
                                        });
                                        var msg = user_nick_name + ' : ' + text;
                                        socket.name = user_nick_name;
                                        io.to(meetingId).emit('receive message', msg);
                                    });


                                });
                                res.render('chat', {meetingId : meetingId}); 
                            }
                            else{

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