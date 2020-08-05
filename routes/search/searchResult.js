
module.exports = function(app, connection){
    //지역 기반 검색 결과
    app.post('/searchbyLocation', (req, res)=>{
        // location = 유저 위치
        var search = req.body.search;
        var user_location = req.body.user_location;
        var sql = "select meeting_id, meeting_name, meeting_location, meeting_time, meeting_recruitment, meeting_img from meeting where meeting_name like '%" + search + "%' and meeting_location like '%" + user_location + "%'";
        connection.query(sql, [user_location], (err, rows, fields)=>{
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
                        'message':'검색 결과 없음'
                    });
                }
                else{
                    res.json({
                        'state':200,
                        'message':'조회 성공',
                        'search_keyword':search,
                        'user_location':user_location,
                        'data': rows
                    });
                }
            }
        });
    });

    //전체 검색 결과
    app.post('/search', (req, res)=>{
        var search = req.body.search;
        var select_sql = "select meeting_id, meeting_name, meeting_location, meeting_time, meeting_recruitment, meeting_img from meeting where meeting_name like '%" + search + "%'";
        connection.query(select_sql, [search], (err, rows, fields)=>{
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
                        'message':'검색 결과 없음'
                    });
                }
                else{
                    res.json({
                        'state':200,
                        'message':'조회 성공',
                        'search_keyword':search,
                        'data':rows
                    });
                }
            }
        });
    });
}