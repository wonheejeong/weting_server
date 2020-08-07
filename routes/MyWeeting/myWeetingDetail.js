module.exports = function(app, connection){

    app.get('/myWeetingDetail/:meeting_id', (req, res) =>{
        // 모임 상세 정보 조회
        var meeting_id = req.params.meeting_id;
        if(req.session.logined){
            //모임 가입 여부 확인
            var select_member_sql = 'select fk_participant_id from meeting_participants where fk_meeting_id=?';
            connection.query(select_member_sql, [meeting_id], (err, rows, fields)=>{
                if(err){
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
                        var select_meeting_sql = 'select * from meeting where meeting_id=?';
                        connection.query(select_meeting_sql, [meeting_id], (err, meeting, fields)=>{
                            if(err){
                                console.log(err);
                                res.json({
                                    'state':500,
                                    'messsage':'서버 에러'
                                });
                            }
                            else{
                                var meeting_interest = meeting[0].fk_meeting_interest;
                                var select_interests_sql = 'select interests_name from meeting_interests where interests_id=?';
                                connection.query(select_interests_sql, [meeting_interest], (err, rows, fields)=>{
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
                                            'meeting_interest':rows[0].interests_name,
                                            'data':meeting
                                        });
                                    }
                                });
                            }
                        })
                    }
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