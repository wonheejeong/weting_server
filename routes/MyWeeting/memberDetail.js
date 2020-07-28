module.exports = function(app, connection){
    //모임 멤버 상세 정보

    app.get('/memberDetail/:id', (req, res)=>{
        var user_id = req.params.id;
        var select_sql = 'select user_nick_name, user_birth, user_img from users where user_id=?';
        connection.query(select_sql, [user_id], (err, rows, fields)=>{
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
    });
}