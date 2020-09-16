module.exports = function(io, app, connection){
    app.get('/chat/:roomId', (req, res)=> {
        var roomId = req.params.roomId;
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
                    connection.query(is_member_sql, [user_id, roomId], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows[0].success){
                                //function 매개변수 socket = 클라이언트와 연결되어 있는 socket 관련 정보들
                                io.once('connection', (socket) => {
                                    socket.name = name;
                                    socket.join(roomId);
                                    console.log('user ' + name + ' joined.');
                                    io.emit('new_connect', name);
                                    io.to(socket.id).emit('create name', name);

                                    socket.on('disconnect', () => {
                                        console.log('user ' + socket.name +  ' leaved');
                                        io.emit('new_disconnect', socket.name);
                                        socket.leave(roomId);
                                    });
                                  
                                    socket.on('send message', (roomId, name, text) => {
                                        var msg = name + ' : ' + text;
                                        console.log(msg);
                                        //socket.name = name;
                                        io.to(roomId).emit('receive message', msg);
                                    }); 
                                });
                                res.render('chat', {roomId : roomId}); 
                            }
                            else{
                                res.json({
                                    'state':300,
                                    'message':'권한 없음'
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