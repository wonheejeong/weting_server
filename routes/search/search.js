module.exports = function(app, connection){
    //검색 및 모임 많은 순 상위 카테고리 8개 조회
    
    app.get('/searchview', (req, res)=>{
        if(req.session.logined){
            var sql = 'select meeting_interests.interests_id, meeting_interests.interests_name as interest_name from meeting_interests, meeting where meeting_interests.interests_id = meeting.fk_meeting_interest group by interests_id having count(meeting_interests.interests_id) order by count(meeting_interests.interests_id) desc;'
            connection.query(sql, (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    var category = (rows.length > 8) ? rows.slice(0,8): rows;
                    res.json({
                        'state':200,
                        'message':'조회 성공',
                        'data':category
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