module.exports = function(app, connection){
    app.get('/myWeetingMembers/:meeting_id/:member_id', (req, res)=>{
        // 모임원 상세 정보 조회
        var meeting_id = req.params.meeting_id;
        var member_id = req.params.member_id;
        if(req.session.logined){
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
                    var is_member_sql = 'select EXISTS (select * from meeting_participants where fk_participant_id = ? and fk_meeting_id=?) as success';
                    connection.query(is_member_sql, [user_id, meeting_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows[0].success){
                                var select_member_sql = 'select fk_participant_id from meeting_participants where fk_meeting_id=?';
                                connection.query(select_member_sql, [meeting_id], (err, rows, fields)=>{
                                    if(err){
                                        console.log(err);
                                        res.json({
                                            'state':500,
                                            'message':'서버 에러'
                                        });
                                    }
                                    else{
                                        if(member_id > rows.length || member_id == 0){
                                            res.json({
                                                'state':404,
                                                'message':'존재하지 않는 사용자'
                                            });
                                        }
                                        else{
                                            var member = rows[member_id - 1].fk_participant_id;
                                            var select_user_sql = 'select user_nick_name, user_introduce, user_img, user_interests from users where user_id=?';
                                            connection.query(select_user_sql, [member], (err, rows, fields)=>{
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
                                                        'data': rows
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else{
                                res.json({
                                    'state':401,
                                    'message':'권한 없음'
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
}