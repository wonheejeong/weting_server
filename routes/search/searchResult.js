
module.exports = function(app, connection){
    //지역 기반 검색 결과
    app.post('/searchbyLocation', (req, res)=>{
        var location = req.body.location;
        var search = req.body.search;
        var sql = "select * from meeting where meeting_name like '%" + search + "%' and meeting_location=?";
        connection.query(sql, [location], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                if(rows.length==0){
                    res.json({
                        'state':404,
                        'message':'검색 결과 없음'
                    });
                }
                else{
                    res.json({
                        'state':200,
                        'message':'조회 성공',
                        'data': rows
                    });
                }
            }
        });
    });

    //전체 검색 결과
    app.post('/search', (req, res)=>{
        var search = req.body.search;
        var select_sql = "select * from meeting where meeting_name like '%" + search + "%'";
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
                        'data':rows
                    });
                }
            }
        });
    });

}