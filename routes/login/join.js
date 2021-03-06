function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 15;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
    }
    //document.randform.randomfield.value = randomstring;
    return randomstring;
    }

module.exports = function(app, connection)
{   
    const crypto = require('crypto');
    const nodemailer = require('nodemailer');
    var mailconfig = require('../../config/mailconfig.json');
    var Image = require('../Image/S3.js');
    var upload = Image('user_img/');


    
    //eamil 중복 확인
    app.post('/login/join/check/email',function(req, res, next){
        console.log('post /join/check/email');
        var user_email = req.body.user_email;
        var sql = 'SELECT * FROM users where user_email = ?;';
        
        connection.query(sql,user_email, function (error, result,fields){
            if(error){
                res.json({
                    'state': 400,
                    'message':'email 중복 확인 실패'
                    });
                console.error('error', error);
            }else{
                if(result.length ==0){
                    res.json({
                        'state': 200,
                        'message':'email 중복 아님'
                        });
                }
                else{
                    res.json({
                        'state': 300,
                        'message':'email 중복'
                        });
                }
            }

        });
    
    });

    //nickname 중복 확인
    app.post('/login/join/check/nickname',function(req, res, next){
        console.log('post /login/join/check/nickname');
        var user_nick_name = req.body.user_nick_name;
        var sql = 'SELECT * FROM weting.users where user_nick_name = ?;';
        connection.query(sql,user_nick_name, function (error, result,fields){
            if(error){
                res.json({
                    'state': 400,
                    'message':'nickname 중복 확인 실패'
                    });
                console.error('error', error);
            }else{
                if(result.length ==0){
                    res.json({
                        'state': 200,
                        'message':'nickname 중복 아님'
                        });
                }
                else{
                    res.json({
                        'state': 300,
                        'message':'nickname 중복'
                        });
                }
            }

        });
    
    });
    
   

    //join
    app.post('/login/join',upload.single('user_img'),function(req, res, next){
        console.log('post /login/join');
        var user_passwd = req.body.user_passwd;
        var user_birth = req.body.user_birth;
        var user_email = req.body.user_email;
        var user_name = req.body.user_name;
        var user_nick_name = req.body.user_nick_name;
        var user_interests = req.body.user_interests;
        var user_img = (req.file == undefined) ? null : req.file.location; 
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassword = crypto.createHash("sha512").update(user_passwd + salt).digest("hex");

        var sql = 'INSERT INTO users SET ?;';
        var params = {
            "user_passwd" : hashPassword,
            "user_salt" : salt,
            "user_birth" : user_birth,
            "user_email" : user_email,
            "user_name" : user_name,
            "user_nick_name" : user_nick_name,
            "user_interests" : user_interests,
            "user_img" : user_img

        };
        connection.query(sql,params, function (error, result,fields){
            if(error) {
                res.json({
                'state': 400,
                'message':'회원가입 실패'
                });
                console.error('error', error);
            }
            else{
                res.json({
                    'state': 200,
                    'message':'회원가입 성공'
                    });
            }
        });
    });

    //이메일 인증
    app.post("/login/join/auth/email", function(req, res, next){
        console.log("/login/join/auth/email");
        let user_email = req.body.user_email;
        var token = randomString();
      
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: mailconfig.email,  
            pass: mailconfig.password     
          }
        });
      
        let mailOptions = {
          from: mailconfig.email,    
          to: user_email ,                     
          subject: '위팅: 이메일 인증번호 안내',   
          html: '<p>안녕하세요.<br>여성들의 안전한 취미 공유 서비스 "위팅"입니다.<br>아래의 인증번호를 입력해 이메일 인증을 완료해주세요 !</p><br><br>' +
          "<b>인증번호: "+token+"</b>"
        };
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.json({
                'state': 400,
                'message':'이메일 발신 실패'
                });
          }
          else {
            console.log('Email sent: ' + info.response);
            res.json({
                'state': 200,
                'token': token,
                'message':'이메일 발신 성공'
                });
          }
        });
      
        
      })


}