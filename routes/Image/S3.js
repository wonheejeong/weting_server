module.exports = function(){
    var multer = require('multer');
    var multerS3 = require('multer-s3');
    const AWS = require("aws-sdk");

    AWS.config.loadFromPath(__dirname + "/../../config/awsconfig.json");

    let s3 = new AWS.S3();

    let upload = multer({
        storage : multerS3({
            s3 : s3, 
            bucket : "weeting",
            key : function(req, file, cb){
                cb(null, "meeting_img/"+Date.now().toString()+'.png');
            },
            acl : 'public-read-write',
            ContentType:'image/png',
            })
        });
        return upload;
    }