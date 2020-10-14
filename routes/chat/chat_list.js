module.exports = function(app, connection){
    //채팅방 목록
    app.get('/chatList', (req, res)=>{
        if(req.session.logined){
            var user_email = req.session.user_email;
            var select_sql = 'select user_nick_name from users where user_email=?';
            connection.query(select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    var user_nick_name = rows[0].user_nick_name;
                    var select_chat_sql = 'select * from chatroom where user_nick_name=?';
                    connection.query(select_chat_sql, [user_nick_name], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length == 0){
                                res.json({
                                    'state':404,
                                    'message':'채팅방 없음'
                                });
                            }
                            else{
                                res.json({
                                    'state':200,
                                    'message':'조회 성공',
                                    'data' : rows
                                })
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

    //채팅방 삭제하기 - 문의방만 삭제 가능 (가입된 모임의 채팅방 삭제? -> 모임 탈퇴 시 삭제됨)
    app.post('/deleteChat', (req, res) => {
        var user_email = req.session.user_email;
        var chatroom_id = req.body.chatroom_id;
        var meeting_id = req.body.meeting_id;
        var user_nick_name_sql = 'select user_nick_name from users where user_email=?';
        connection.query(user_nick_name_sql, [user_email], (err, rows, fields) => {
            if(err){
                console.log(err);
                res.json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                var user_nick_name = rows[0].user_nick_name;

                var delete_chatroom = 'delete from chatroom where chatroom_id=?';
                connection.query(delete_chatroom, [chatroom_id], (err, rows, fields) => {
                    if(err){
                        console.log(err);
                        res.json({
                            'state':500,
                            'message':'서버 에러'
                        });
                    }
                    else{
                        //채팅 기록 삭제
                        var delete_chat_sql = 'delete from chat where meeting_id=? and user_nick_name=? and room=0';
                        connection.query(delete_chat_sql, [meeting_id, user_nick_name], (err, rows, fields) => {
                            if(err){
                                console.log(err);
                                res.json({
                                    'state':500,
                                    'message':'서버 에러'
                                });
                            }
                            else{                                                        
                                res.json({
                                    'state':200,
                                    'message':'삭제 성공'
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}