module.exports = function(app, connection)
{
    app.post('/mypage/edit/password',function(req, res, next){
        console.log('post /mypage/edit/password');
        var user_email = req.body.user_email;
        var user_passwd = req.body.user_passwd;

        var sql = 'UPDATE users SET user_passwd = ? WHERE user_email =?;';
        connection.query(sql,[user_passwd, user_email], function (error, result,fields){
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
                    'message':'비밀번호 변경 성공'
                    });
            }
        });
    });

}
