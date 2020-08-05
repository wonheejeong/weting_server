module.exports = function(app, connection){
    // 모임원 조회
    app.get('/myWeetingMembers/:meeting_id', (req, res)=>{
        // meeting_id = 모임ID
        var meeting_id= req.params.meeting_id;
        if(req.session.logined){
            var member_sql = 'select users.user_nick_name, users.user_img, user_introduce from users join meeting_participants on users.user_id = meeting_participants.fk_participant_id where fk_meeting_id=?';
            connection.query(member_sql, [meeting_id], (err, rows, fields)=>{
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
                        res.json({
                            'state':200,
                            'message':'조회 성공',
                            'data':rows
                        });
                    }
                }
            });
        }
        else{
            res.json({
                'state':300,
                'message':'로그인 필요'
            });
        }
    });
}