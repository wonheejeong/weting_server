module.exports = function(app, connection){

    //모임 삭제창
    app.get('/myWeetingDelete/:meeting_id', (req, res)=>{
        var meeting_id = req.params.meeting_id;
        if(req.session.logined){
            var user_email = req.session.user_email;
            var select_user_sql = 'select user_id from users where user_email=?';
            connection.query(select_user_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    var user_id = rows[0].user_id;
                    //모임장 확인
                    var select_captain_sql = 'select * from meeting where fk_captain_id=? and meeting_id=?';
                    connection.query(select_captain_sql, [user_id, meeting_id], (err, rows, fields)=>{
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
                                    'state':401,
                                    'message':'권한 없음'
                                });
                            }
                            else{
                                var select_interest_sql = 'select interests_name from meeting_interests where interests_id=?';
                                connection.query(select_interest_sql, [rows[0].fk_meeting_interest], (err, result, fields)=>{
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
                                            'meeting_interest':result[0].interests_name,
                                            'data':rows
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