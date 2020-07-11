module.exports = function(app, connection){

    app.get('/myWeetingMembers/:id', (req, res)=>{
        var id = req.params.id;
        var select_sql = 'SELECT fk_participant_user_id FROM meeting_participants WHERE fk_meeting_id=?';
        connection.query(select_sql, [id], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                if(rows.length == 0){
                    res.status(404).json({
                        'state':404,
                        'message':'존재하지 않는 모임'
                    })
                }
                else{
                    var join_sql = 'SELECT * FROM user INNER JOIN meeting_participants ON user.user_id = meeting_participants.fk_participant_user_id WHERE fk_meeting_id=?';
                    connection.query(join_sql, [id], (err, result, fields)=>{
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                'state':500,
                                'message':'서버 에러'
                            })
                        }
                        else{
                            res.status(200).json({
                                'state':200,
                            });
                        }
                    });
                }
            }
        });
    });
}