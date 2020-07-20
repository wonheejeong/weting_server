module.exports = function(app, connection){
    //카테고리 별 모임 리스트 조회
    
    app.get('/weeting/:category', (req, res)=>{
        var category  = req.params.category;
        var select_sql = 'select interests_id from meeting_interests where interests_name=?';
        connection.query(select_sql, [category], (err, rows, fields)=>{
            if(err){
                console.log(err);
            }
            else{
                if(rows.length == 0){
                    res.status(404).json({
                        'state':404,
                        'message':'존재하지 않는 카테고리'
                    });
                }
                else{
                    var interest_id = rows[0].interests_id;
                    var sql = 'select * from meeting where fk_meeting_interest=?';
                    connection.query(sql, [interest_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length==0){
                                res.status(300).json({
                                    'state':300,
                                    'message':'해당 카테고리 모임 없음'
                                });
                            }
                            else{
                                res.status(200).json({
                                    'state':200,
                                    'message':'조회 성공',
                                    'data':rows
                                });
                            }
                        }
                    });
                }
            }
        });
    });
}