module.exports = function(app, connection){
    var Image = require('../Image/S3.js');
    var upload = Image();

    app.get('/MyweetingUpdate/:id', (req, res)=>{
        //id = 나의 모임 개수 기준 번호
        var id= req.params.id; 
        if(req.session.logined){
            //로그인 상태
            var user_email = req.session.user_email;
            var select_sql = 'SELECT user_id FROM users WHERE user_email=?';
            connection.query(select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    var user_id = rows[0].user_id;
                    var select_meeting_sql = 'SELECT * FROM meeting WHERE fk_captain_id=?';
                    connection.query(select_meeting_sql, [user_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length== 0 || id > rows.length || id==0){
                                res.json({
                                    'state':404,
                                    'message':'모임 없음'
                                });
                            }
                            else{
                                res.json({
                                    'state':200,
                                    'message':'모임 조회 성공',
                                    'data':rows[id-1]
                                });
                            }
                        }
                    });
                }
            });
        }
        //로그인 X
        else{
            res.json({
                'state':300,
                'message':'로그아웃 상태'
            });
        }
    });

    //update 전송
    app.post('/myWeetingUpdate', upload.single('meeting_img'), (req, res)=>{
        var body = req.body;
        if(req.file == undefined){
            var img_select_sql = 'select meeting_img from meeting where meeting_id=?';
            connection.query(img_select_sql, [body.meeting_id], (err, results, fields)=>{
                if(err){
                    console.log(err);
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    var meeting_img = (results[0].length == 0) ? null : results[0].meeting_img;
                }
            })
        }
        else{
            var meeting_img = req.file.location;
            }
        var update_sql = 'UPDATE meeting SET fk_meeting_interest=?, meeting_name=?, meeting_description=?, meeting_location=?, meeting_recruitment=?, meeting_time=?, age_limit_min=?, age_limit_max=?, meeting_img=? WHERE meeting_id=?';
        connection.query(update_sql, [body.fk_meeting_interest, body.meeting_name, body.meeting_description, body.meeting_location, body.meeting_recruitment, body.meeting_time, body.age_limit_min, body.age_limit_max, meeting_img, body.meeting_id], (err, rows, fields)=>{
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
                    'message':'수정 성공'
                });
            }
        })
    });
}