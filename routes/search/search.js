module.exports = function(app, connection){
    //검색 및 모임 많은 순 상위 카테고리 8개 조회
    
    app.get('/search', (req, res)=>{
        var sql = 'select meeting_interests.interests_name as name, count(meeting_interests.interests_id) as cnt_id from meeting_interests, meeting where meeting_interests.interests_id = meeting.fk_meeting_interest group by interests_id order by cnt_id desc';        
        connection.query(sql, (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                var category = (rows.length > 8) ? rows.slice(0,8): rows;
                res.status(200).json({
                    'state':200,
                    'message':'조회 성공',
                    'data':category
                });
            }
        });
    });
}