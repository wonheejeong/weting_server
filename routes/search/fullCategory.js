module.exports = function(app, connection){
    //전체 카테고리 조회
    
    app.get('/fullCategory', (req, res)=>{
        if(req.session.logined){
            var select_sql = 'select * from meeting_interests';
            connection.query(select_sql, (err, rows, fields)=>{
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
                        'data':rows
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