module.exports = function(app, connection){

    //delete 창
    app.get('/myWeetingDelete/:id', (req, res)=>{
        var id = req.params.id;
        var select_sql = 'SELECT * FROM meeting WHERE meeting_id=?';

        connection.query(select_sql, [id], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message':'서버 에러'
                })
            }
            else{
                if(rows.length === 0){
                    res.status(404).json({
                        'state':404,
                        'message':'존재하지 않는 모임'
                    })
                }
                else{
                    res.status(200).json({'state':200});
                }
            }
        });
    })

    //delete 요청 전송
    app.post('/myWeetingDelete/:id', (req, res)=>{
        var id = req.params.id;
        var select_sql = 'SELECT meeting_img FROM meeting WHERE meeting_id=?';
        connection.query(select_sql, [id], (err, location, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                if(location.length == 0){
                    res.status(404).json({
                        'state':404,
                        'message':'존재하지 않는 모임'
                    });
                }
                else{
                    var delete_sql = 'DELETE FROM meeting WHERE meeting_id=?';
                    connection.query(delete_sql, [id], (err, rows, fileds)=>{
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                'state':'서버 에러'
                            });
                        }else{
                            res.status(200).json({
                                'state':200,
                                'message':'모임 삭제 성공'
                            });
                        }
                    });
                }
            }
        })
    });
}