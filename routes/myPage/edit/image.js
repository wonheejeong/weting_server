module.exports = function(app, connection)
{

    var Image = require('../../Image/S3.js');
    var upload = Image('user_img/');

    app.post('/mypage/edit/img',upload.single('user_img'),function(req, res, next){
        console.log('post /mypage/edit/img')
        var user_email = req.session.user_email;
        var user_img = (req.file == undefined) ? null : req.file.location;
        var sql = 'UPDATE users SET user_img = ? WHERE user_email =?;';
        connection.query(sql,[user_img, user_email], function (error, result,fields){
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
                    'message':'이미지 수정 성공'
                    });
            }
        });

    });

}