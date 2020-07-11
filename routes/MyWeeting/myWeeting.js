module.exports = function(app, connection){

    //myweeting list
    app.get('/myWeeting/:id', (req, res)=>{
        var id = req.params.id;
        var select_sql = 'SELECT * FROM meeting WHERE fk_user_id=?';
        connection.query(select_sql, [id], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.json({
                    'state': 400,
                    'message' : '나의 모임 조회 실패'
                });
            }
            else{
                res.status(200).json({
                    'state':200,
                });
            }
        });
    });
}