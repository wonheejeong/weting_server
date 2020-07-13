module.exports = function(app, connection){

    //내가 만든 모임 list
    app.get('/myWeeting', (req, res)=>{
        if(req.session.logined){
            var user_email = req.session.user_email;
            var select_sql = 'SELECT user_email, user_id FROM users WHERE user_email = ?';
            connection.query(select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    var captain_id = rows[0].user_id;
                    var meeting_select_sql = 'SELECT * FROM meeting WHERE fk_captain_id = ?';
                    connection.query(meeting_select_sql, [captain_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length==0){
                                res.status(300).json({
                                    'state':300,
                                    'message':'내가 만든 모임 없음'
                                });
                            }
                            else{
                                res.status(200).json({
                                    'state':200,
                                    'message': '조회 성공',
                                });
                            }
                        }
                    });
                }
            });
        }
        else{
            res.status(300).json({
                'state':300,
                'message':'로그인 필요'
            });
        }
    });
}