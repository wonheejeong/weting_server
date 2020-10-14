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
                            res.json({
                                'state':200,
                                'message':'조회 성공',
                                'data' : rows
                            });
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

    //채팅방 삭제하기
    app.post('/deleteChat', (req, res) => {
        var chatroom_id = req.body.chatroom_id;
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
                res.json({
                    'state':200,
                    'message':'삭제 성공'
                });
            }
        });
    });
}