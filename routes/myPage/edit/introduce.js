module.exports = function(app, connection)
{
    app.post('/mypage/edit/introduce',function(req, res, next){
        console.log('post /mypage/edit/introduce');
        var user_email = req.session.user_email;
        var user_introduce = req.body.user_introduce;

        var sql = 'UPDATE users SET user_introduce = ? WHERE user_email =?;';
        connection.query(sql,[user_introduce, user_email], function (error, result,fields){
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
                    'message':'소개말 수정 성공'
                    });
            }
        });
    });

}
