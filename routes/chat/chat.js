module.exports = function(io, app, connection){
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
                    var name = rows[0].user_nick_name;
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
                            if(rows[0]){
                                var namespace_chat = io.of('/chat');
                                var room = meeting_id;

                                //function 매개변수 socket = 클라이언트와 연결되어 있는 socket 관련 정보들
                                namespace_chat.once('connection', function(socket){
                                    console.log('user connected: ', name);  
                                    socket.name = name;
                                    io.to(socket.id).emit('create name', name);   
                                    io.emit('new_connect', name);

                                    socket.on('disconnect', function(){ 
                                        console.log('user disconnected: '+ socket.id + ' ' + socket.name);
                                        io.emit('new_disconnect', socket.name);
                                    });
                                
                                    socket.on('send message', function(name, text){ 
                                        var msg = name + ' : ' + text;
                                        socket.name = name;
                                        console.log(msg);
                                        io.emit('receive message', msg);
                                    });
                                });  
                            }
                            else{
                                res.json({
                                    'state':300,
                                    'message':'권한 없음'
                                });
                            }
                        }
                    });
                    res.render('chat'); 
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