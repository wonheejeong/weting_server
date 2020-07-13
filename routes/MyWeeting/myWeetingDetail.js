module.exports = function(app, connection){

    app.get('/myWeetingDetail/:id', (req, res) =>{
        //id = myweeting list No.
        var id = req.params.id;
        if(req.session.logined){
            var user_email = req.session.user_email;
            var user_select_sql = 'SELECT user_id FROM users WHERE user_email=?'
            connection.query(user_select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                //user_id 조회 후
                else{
                    var user_id = rows[0].user_id;
                    var select_sql = 'SELECT * from meeting WHERE fk_captain_id=?';
                    connection.query(select_sql, [user_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.sttus(500).json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length==0 || id > rows.length || id==0){
                                res.status(404).json({
                                    'state':404,
                                    'message':'모임 없음'
                                });
                            }
                            else{
                                res.status(200).json({
                                    'state':200,
                                    'message':'모임 상세 정보 조회 성공',
                                });
                            }
                            }
                        });
                    }
            });
        }
        else{
            res.status(400).json({
                'state':400,
                'message':'로그인 필요'
            });
        }
    });
}