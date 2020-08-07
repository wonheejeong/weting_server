module.exports = function(app, connection){
    //로그인 후 메인
    app.get('/main', (req, res)=>{
        if(req.session.logined){
            var user_email = req.session.user_email;
            var select_user_sql = 'select user_id, user_interests from users where user_email=?';
            connection.query(select_user_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    //모임 추천
                    var user_id = rows[0].user_id;
                    var user_interests = rows[0].user_interests.split('/');
                    for (var i in user_interests){
                        user_interests[i] = JSON.stringify(user_interests[i]);
                    }
                    var select_recommend_sql = 'SELECT meeting_id, meeting_name, meeting_img FROM meeting JOIN meeting_interests ON meeting.fk_meeting_interest= meeting_interests.interests_id WHERE meeting_interests.interests_name IN ('
                    +user_interests.join()+');';
                    connection.query(select_recommend_sql, [user_interests], (err, reco_meetings, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(reco_meetings.length == 0){
                                res.json({
                                    'state':404,
                                    'message':'추천 모임 없음'
                                });
                            }
                            else{
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
                                            var limit = reco_meetings.length - 3;
                                            var limit_num = Math.floor(Math.random() * (limit - 1) + 1);
                                            // 모임 추천 4개
                                            res.json({
                                                'state':200,
                                                'message':'조회 성공',
                                                'recommend_meetings': reco_meetings.slice(limit_num, limit_num + 4)
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
                                                    // 모임 추천 2개 + 내 모임 2개
                                                    var limit_ = reco_meetings.length - 1;
                                                    var limit_num_ = Math.floor(Math.random() * (limit_ - 1) + 1)
                                                    var meetings = (rows.length > 2) ? rows.slice(0, 2) : rows;
                                                    res.json({
                                                        'state':200,
                                                        'message':'조회 성공',
                                                        'recommend_meetings':reco_meetings.slice(limit_num_, limit_num_ + 2),
                                                        'my_meetings':meetings
                                                    });
                                                }
                                            });
                                        }
                                    }
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