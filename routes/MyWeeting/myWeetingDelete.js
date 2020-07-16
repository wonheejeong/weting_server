module.exports = function(app, connection){

    //delete 창
    app.get('/myWeetingDelete/:id', (req, res)=>{
        //id = myweeting list No.
        var id=req.params.id;
        if(req.session.logined){
            //로그인 상태
            var user_email = req.session.user_email;
            var select_sql = 'SELECT user_id FROM users WHERE user_email = ?';
            connection.query(select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    //user_id 조회
                    var user_id = rows[0].user_id;
                    var select_meeting_sql = 'SELECT * FROM meeting WHERE fk_captain_id=?';
                    connection.query(select_meeting_sql, [user_id], (err, rows, fields)=>{
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
                                    'message':'삭제할 모임 없음'
                                });
                            }
                            else{
                                if(id>rows.length || id==0){
                                    res.status(404).json({
                                        'state':404,
                                        'message':id+'번째 모임 없음'
                                    });
                                }
                                else{
                                    res.status(200).json({
                                        'state':200,
                                        'message':'조회 성공',
                                        'data': rows[0]
                                    });
                                }
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

    //delete 전송
    app.post('/myWeetingDelete/:id', (req, res)=>{
        //id = myweeting list No.
        var id=req.params.id;
        if(req.session.logined){
            //로그인 상태
            var user_email = req.session.user_email;
            var select_sql = 'SELECT user_id FROM users WHERE user_email = ?';
            connection.query(select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    //user_id 조회
                    var user_id = rows[0].user_id;
                    var select_meeting_sql = 'SELECT * FROM meeting WHERE fk_captain_id=?';
                    connection.query(select_meeting_sql, [user_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length==0 || id> rows.length || id==0){
                                res.status(404).json({
                                    'state':404,
                                    'message':'삭제할 모임 없음'
                                });
                            }
                            else{
                                var delete_meeting = rows[id-1].meeting_id;
                                var delete_sql = 'DELETE FROM meeting WHERE meeting_id=?';
                                connection.query(delete_sql, [delete_meeting], (err, rows, fields)=>{
                                    if(err){
                                        console.log(err);
                                        res.status(500).json({
                                            'state':500,
                                            'message':'서버 에러'
                                        });
                                    }
                                    else{
                                        res.status(200).json({
                                            'state':200,
                                            'message':'삭제 성공'
                                        });
                                    }
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