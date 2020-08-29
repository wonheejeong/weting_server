module.exports = function(app, connection){
    // 나의 모임 목록
    app.get('/myWeeting', (req, res)=>{
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
                    var select_meeting_sql = 'select meeting_id, meeting_name, meeting_img, meeting_location, meeting_time, (select count(fk_participant_id) from meeting_participants where fk_meeting_id=meeting_id) as present_members from meeting join meeting_participants on meeting.meeting_id = meeting_participants.fk_meeting_id where fk_participant_id=?';
                    connection.query(select_meeting_sql, [user_id], (err, rows, fields)=>{
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
                                    'state':404,
                                    'message':'모임 없음'
                                });
                            }
                            else{
                                res.json({
                                    'state':200,
                                    'message':'조회 성공',
                                    'data':rows
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