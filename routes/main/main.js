module.exports = function(app, connection){
    //로그인 후 메인
    app.get('/main', (req, res)=>{
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
                    // 관심 카테고리 여부 확인
                    var has_interests_sql = 'select user_interests from users where user_id=?';
                    connection.query(has_interests_sql, [user_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows[0].user_interests == null){
                                res.json({
                                    'message':'관심사 추가 필요'
                                });
                            }
                            else{
                                //추천 모임
                                var has_meeting_sql = 'select * from meeting_participants where fk_participant_id=?';
                                connection.query(has_meeting_sql, [user_id], (err, rows, fields)=>{
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
                                                'message':'나의 모임 없는 상태'
                                            });
                                        }
                                        else{
                                            // 내 모임 조회
                                            var select_meeting_sql = 'select meeting_id, meeting_name, meeting_img from meeting join meeting_participants on meeting.meeting_id = meeting_participants.fk_meeting_id where fk_participant_id=?';
                                            connection.query(select_meeting_sql, [user_id], (err, rows, fields)=>{
                                                if(err){
                                                    console.log(err);
                                                    res.json({
                                                        'state':500,
                                                        'message':'서버 에러'
                                                    });
                                                }
                                                else{
                                                    var meetings = (rows.length > 2) ? rows.slice(0, 2) : rows;
                                                    res.json({
                                                        'state':200,
                                                        'message':'조회 성공',
                                                        'meetings':meetings
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    })
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