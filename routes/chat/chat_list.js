module.exports = function(app, connection){
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
}