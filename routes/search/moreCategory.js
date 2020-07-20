module.exports = function(app, connection){
    //전체 카테고리 조회
    
    app.get('/moreCategory', (req, res)=>{
        var select_sql = 'select * from meeting_interests';
        connection.query(select_sql, (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                res.status(200).json({
                    'state':200,
                    'message':'조회 성공',
                    'data':rows
                });
            }
        });
    });
}