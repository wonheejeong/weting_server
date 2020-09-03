module.exports = function(app, connection)
{
    const crypto = require('crypto');


    //session login
    app.get('/', (req, res) => {      // 1
        console.log('get /');
            if(req.session.logined) {
                res.send({
                    'state': 200,
                    'message': '로그인 상태'
                });
            } else {
                res.send({
                    'state':400,
                    'message':'로그아웃 상태'
                });
            }
    });

    //session logout
    app.post('/logout', (req, res) => {      
        console.log('post /logout');
        req.session.destroy();
        res.send({
            'state':200,
            'message': '로그아웃 성공'})
    });

    //login
    app.post('/login/login', function(req, res){
        console.log('post /login/login');
        var user_email = req.body.user_email;
        var user_passwd = req.body.user_passwd;
        var sql = 'SELECT * FROM users WHERE user_email = ?;';
        connection.query(sql, user_email, function(error,results,fields){
            if (error) {
                res.json({
                'state': 400,
                'message': "통신 에러"
                });
                console.log(error);
            } else {
                if(results.length > 0) {
                    let salt = results[0].user_salt;
                    let hashPassword = crypto.createHash("sha512").update(user_passwd + salt).digest("hex");

                    if(results[0].user_passwd == hashPassword) {
                        req.session.logined = true;
                        req.session.user_email = user_email;
                        res.json({
                        'state': 200,
                        'message': "로그인 성공"
                        });
                    } else {
                        res.json({
                        'state': 300,
                        'message': "로그인 실패-비밀번호 불일치"

                        });
                    }
                } else {
                    res.json({
                    'state': 350,
                    'message': "로그인 실패-존재하지 않는 eamil"
                    });
                }
            }
        });
    });

}