module.exports = function(app, connection)
{
    const nodemailer = require('nodemailer');
    var mailconfig = require('../../config/mailconfig.json');
    app.post('/mypage/contact',function(req, res, next){
        console.log('post /mypage/contact');
        var user_email = req.session.user_email;
        var content = req.body.content;
      
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: mailconfig.email,  
            pass: mailconfig.password     
          }
        });
      
        let mailOptions = {
          from: mailconfig.email,    
          to: mailconfig.email ,                     
          subject: '위팅: 고객 문의 내역',   
          html: '고객 이메일: '+ user_email+ '<br>고객 문의 내역 : '+content
        };
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.json({
                'state': 400,
                'message':'문의 발신 실패'
                });
          }
          else {
            console.log('Email sent: ' + info.response);
            res.json({
                'state': 200,
                'message':'문의 발신 성공'
                });
          }
        });
    });

}
