module.exports = function(app, connection){
    //모임 참여
    app.post('/participate', (req, res)=>{
        var meeting_id = req.body.meeting_id;
        var user_email = req.session.user_email;
        var select_sql = 'select user_id from users where user_email=?';
        connection.query(select_sql, [user_email], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                var user_id = rows[0].user_id;
                var is_member_sql = 'select EXISTS (select * from meeting_participants where fk_meeting_id=? and fk_participant_id=?) as success';
                connection.query(is_member_sql, [meeting_id, user_id], (err, rows, fields)=>{
                    if(err){
                        console.log(err);
                        res.json({
                            'state':500,
                            'message':'서버 에러'
                        });
                    }
                    else{
                        if(rows[0].success){
                            res.json({
                                'state':300,
                                'message':'참여 상태'
                            });
                        }
                        else{
                            var insert_sql = 'insert into meeting_participants (fk_meeting_id, fk_participant_id) values (?, ?)';
                            connection.query(insert_sql, [meeting_id, user_id], (err, rows, fields)=>{
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
                                        'message':'모임 참여 성공'
                                    });
                                }
                            });
                        }
                    }
                })
            }
        });
    });
    
    //모임 탈퇴
    app.post('/withdraw', (req, res)=>{
        var meeting_id = req.body.meeting_id;
        var user_email = req.session.user_email;
        var select_sql = 'select user_id from users where user_email=?';
        connection.query(select_sql, [user_email], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                //모임장일 경우 탈퇴 불가능
                var user_id = rows[0].user_id;
                var is_captain_sql = 'select fk_captain_id from meeting where meeting_id=?';
                connection.query(is_captain_sql, [meeting_id], (err, rows, fields)=>{
                    if(err){
                        console.log(err);
                        res.json({
                            'state':500,
                            'message':'서버 에러'
                        });
                    }
                    else{
                        if(user_id == rows[0].fk_captain_id){
                            res.json({
                                'state':300,
                                'message':'탈퇴 불가'
                            });
                        }
                        else{
                            //모임장 아닐 경우 모임원 여부 확인
                            var is_member_sql = 'select EXISTS (select * from meeting_participants where fk_meeting_id=? and fk_participant_id=?) as success';
                            connection.query(is_member_sql, [meeting_id, user_id], (err, rows, fields)=>{
                                if(err){
                                    console.log(err);
                                    res.json({
                                        'state':500,
                                        'message':'서버 에러'
                                    });
                                }
                                else{
                                    if(rows[0].success){
                                        var delete_sql = 'delete from meeting_participants where fk_meeting_id=? and fk_participant_id=?';
                                        connection.query(delete_sql, [meeting_id, user_id], (err, rows, fields)=>{
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
                                                    'message':'탈퇴 성공'
                                                });
                                            }
                                        });
                                    }
                                    else{
                                        res.json({
                                            'state':300,
                                            'message':'탈퇴 상태'
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    })
}