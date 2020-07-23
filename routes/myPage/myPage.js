module.exports = function(app, connection)
{
    app.get('/mypage',function(req, res, next){
        console.log('get /mapage');
        var user_email = req.session.user_email;
        var sql = 'SELECT user_nick_name, user_img,user_introduce, user_interests, user_birth, user_email FROM users WHERE user_email =?;';
        connection.query(sql,user_email, function (error, result,fields){
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
                    "list": result,
                    'message':'회원 정보 조회 성공'
                    });
            }
        });


    });
}