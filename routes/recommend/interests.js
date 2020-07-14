module.exports = function(app, connection)
{
    app.post('/edit/interests',function(req, res, next){
        console.log('post /edit/interests');
        var user_email = req.body.user_email;
        var user_interests = req.body.user_interests;

        var sql = 'UPDATE users SET user_interests = ? WHERE user_email =?;';
        connection.query(sql,[user_interests, user_email], function (error, result,fields){
            if(error) {
                res.json({
                'state': 400,
                'message': '통신 실패'
                });
                console.error('error', error);
            }
            else{
                res.json({
                    'state': 200,
                    'message':'관심사 수정 성공'
                    });
            }
        });
    });

}
