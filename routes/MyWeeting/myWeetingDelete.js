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
                    res.json({
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
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length == 0 || id > rows.length || id==0){
                                res.json({
                                    'state':404,
                                    'message':'삭제할 모임 없음'
                                });
                            }
                            else{
                                res.json({
                                    'state':200,
                                    'message':'조회 성공',
                                    'data': rows[id-1]
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

    //delete 전송
    app.post('/myWeetingDelete', (req, res)=>{
        var meeting_id = req.body.meeting_id;
        var delete_sql = 'delete from meeting where meeting_id=?';
        connection.query(delete_sql, [meeting_id], (err, rows, fields)=>{
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