module.exports = function(app, connection){
    //모임원 조회
    app.get('/myWeetingMembers/:id', (req, res)=>{
        //my weeting list No.
        var id= req.params.id;
        if(req.session.logined){
                var select_sql = 'SELECT user_id FROM users WHERE user_email=?';
                connection.query(select_sql, [req.session.user_email], (err, rows, fields)=>{
                    if(err){
                        console.log(err);
                        res.status(500).json({
                            'state':500,
                            'message':'서버 에러'
                        });
                    }
                    else{
                        var user_id= rows[0].user_id;
                        //user_id 조회 성공
                        var select_meeting_sql = 'SELECT meeting_id FROM meeting WHERE fk_captain_id=?';
                        connection.query(select_meeting_sql, [user_id], (err, rows, fields)=>{
                            if(err){
                                console.log(err);
                                res.status(500).json({
                                    'state':500,
                                    'message':'서버 에러'
                                });
                            }
                            else{
                                if(rows.length==0 || id > rows.length || id==0){
                                    //내가 만든 모임 없음
                                    res.status(404).json({
                                        'state':404,
                                        'message':'해당 모임 없음'
                                    });
                                }
                                else{
                                    var meeting_id = rows[id-1].meeting_id
                                    var select_participant_sql = 'SELECT fk_participant_id FROM meeting_participants WHERE fk_meeting_id=?';
                                    connection.query(select_participant_sql, [meeting_id], (err, rows, fields)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            res.status(200).json({
                                                'state':200,
                                                'message':'조회 성공'
                                            });
                                        }
                                    })
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