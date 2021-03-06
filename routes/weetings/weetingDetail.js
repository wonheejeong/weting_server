module.exports = function(app, connection){
    app.get('/weetingDetail/:meeting_id', (req, res)=>{
        var meeting_id = req.params.meeting_id;
        // 모임 상세 정보 조회 
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
                    var select_meeting_sql = 'select meeting.fk_meeting_interest, meeting.meeting_name, meeting.meeting_description, meeting.meeting_location, meeting.meeting_time, meeting.meeting_recruitment, meeting.age_limit_min, meeting.age_limit_max, meeting.meeting_img, (select count(fk_participant_id) from meeting_participants where fk_meeting_id=meeting_id) as present_members, users.user_nick_name as captain_nick_name from meeting join users on meeting.fk_captain_id = users.user_id where meeting_id=?';
                    connection.query(select_meeting_sql, [meeting_id], (err, meeting, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(meeting.length == 0){
                                res.json({
                                    'state':404,
                                    'message':'존재하지 않는 모임'
                                });
                            }
                            else{
                                var meeting_interest_id = meeting[0].fk_meeting_interest;
                                var select_interest_sql = 'select interests_name from meeting_interests where interests_id=?';
                                connection.query(select_interest_sql, [meeting_interest_id], (err, interest, fields)=>{
                                    if(err){
                                        console.log(err);
                                        res.json({
                                            'state':500,
                                            'message':'서버 에러'
                                        });
                                    }
                                    else{
                                        var meeting_interest = interest[0].interests_name;
                                        var is_member_sql = 'select EXISTS (select * from meeting_participants where fk_participant_id = ? and fk_meeting_id=?) as success';
                                        connection.query(is_member_sql, [user_id, meeting_id], (err, is_member, fields)=>{
                                            if(err){
                                                console.log(err);
                                                res.json({
                                                    'state':500,
                                                    'message':'서버 에러'
                                                });
                                            }
                                            else{
                                                if(is_member[0].success){
                                                    //모임원일 경우 모임원 조회
                                                    var member_sql = 'select users.user_id, users.user_nick_name, users.user_img, user_introduce from users join meeting_participants on users.user_id = meeting_participants.fk_participant_id where fk_meeting_id=?';
                                                    connection.query(member_sql, [meeting_id], (err, members, fields)=>{
                                                        if(err){
                                                            console.log(err);
                                                            res.json({
                                                                'state':500,
                                                                'message':'서버 에러'
                                                            });
                                                        }
                                                        else{
                                                            var is_captain_sql = 'select fk_captain_id from meeting where meeting_id=?';
                                                            connection.query(is_captain_sql, [meeting_id], (err, rows, fields) => {
                                                                if(err){
                                                                    console.log(err);
                                                                    res.json({
                                                                        'state':500,
                                                                        'message':'서버 에러'
                                                                    });
                                                                }
                                                                else{
                                                                    var is_captain = (user_id == rows[0].fk_captain_id) ? 1 : 0;
                                                                    res.json({
                                                                        'state':200,
                                                                        'message':'조회 성공',
                                                                        'is_member':is_member[0].success,
                                                                        'is_captain' : is_captain,
                                                                        'meeting_id' : meeting_id,
                                                                        'meeting_interest':meeting_interest,
                                                                        'data':meeting,
                                                                        'meeting_members':members,
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else{
                                                    //모임원 아닐 경우
                                                    res.json({
                                                        'state':200,
                                                        'message':'조회 성공',
                                                        'is_member':is_member[0].success,
                                                        'meeting_id' : meeting_id,
                                                        'meeting_interest':meeting_interest,
                                                        'data':meeting
                                                    });
                                                }
                                            }
                                        })
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
}