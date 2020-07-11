module.exports = function(app, connection){

    app.get('/myWeetingDetail/:id', (req, res) =>{
        var id = req.params.id;
        var join_sql = 'SELECT * FROM meeting INNER JOIN meeting_interests ON meeting.fk_meeting_interest = meeting_interests.interests_id WHERE meeting_id=?';

        connection.query(join_sql, [id], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message': '상세 정보 조회 실패'
                });
            }
            else{
                if(rows.length == 0){
                    res.status(404).json({
                        'state':404,
                        'message':'존재하지 않는 모임'
                    });
                }
                else{
                    
                    res.status(200).json({
                        'state':200,
                        'message':'모임 상세 정보 조회 성공',
                    });
                }
            }
        });
    });
}