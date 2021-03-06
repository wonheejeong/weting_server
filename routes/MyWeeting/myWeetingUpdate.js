module.exports = function(app, connection){
    var Image = require('../Image/S3.js');
    var upload = Image();

    app.get('/myWeetingUpdate/:meeting_id', (req, res)=>{
        var meeting_id = req.params.meeting_id;
        if(req.session.logined){
            var user_email = req.session.user_email;
            var select_user_sql = 'select user_id from users where user_email=?';
            connection.query(select_user_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    console.log(err);
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    var user_id = rows[0].user_id;
                    //모임장 확인
                    var select_captain_sql = 'select fk_meeting_interest, meeting_id, meeting_name, meeting_description, meeting_location, meeting_time, (select count(fk_participant_id) from meeting_participants where fk_meeting_id=meeting_id) as present_members, meeting_recruitment, age_limit_min, age_limit_max, meeting_img from meeting where fk_captain_id=? and meeting_id=?';
                    connection.query(select_captain_sql, [user_id, meeting_id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.json({
                                'state':500,
                                'message':'서버 에러'
                            });
                        }
                        else{
                            if(rows.length == 0){
                                res.json({
                                    'state':401,
                                    'message':'권한 없음'
                                });
                            }
                            else{
                                //카테고리 전송
                                var select_interest_sql = 'select * from meeting_interests';
                                connection.query(select_interest_sql, (err, result, fields)=>{
                                    if(err){
                                        console.log(err);
                                        res.json({
                                            'state':500,
                                            'message':'서버 에러'
                                        });
                                    }
                                    else{                           
                                        for(var i=0; i < result.length; i++){
                                            if(result[i].interests_id == rows[0].fk_meeting_interest){
                                                var meeting_interest = result[i].interests_name;
                                            }
                                        }
                                        res.json({
                                            'state':200,
                                            'message':'조회 성공',
                                            'category':result,
                                            'meeting_interest':meeting_interest,
                                            'data':rows
                                        })                                        
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
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
        var meeting_img = (req.file == undefined) ? body.meeting_img : req.file.location;
        var select_interest_sql = 'select interests_id from meeting_interests where interests_name = ?';
        connection.query(select_interest_sql, [body.meeting_interest], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                var meeting_interest = rows[0].interests_id;
                var update_sql = 'UPDATE meeting SET fk_meeting_interest=?, meeting_name=?, meeting_description=?, meeting_location=?, meeting_recruitment=?, meeting_time=?, age_limit_min=?, age_limit_max=?, meeting_img=? WHERE meeting_id=?';
                connection.query(update_sql, [meeting_interest, body.meeting_name, body.meeting_description, body.meeting_location, body.meeting_recruitment, body.meeting_time, body.age_limit_min, body.age_limit_max, meeting_img, body.meeting_id], (err, rows, fields)=>{
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
                });
            }
        });
    });

    app.post('/changeCaptain', (req, res) => {
        //모임 ID, 권한 넘길 사용자 id, nick_name 필요
        var meeting_id = req.body.meeting_id;
        var user_id = req.body.user_id;
        var user_nick_name = req.body.user_nick_name;
        var update_sql = 'update meeting set fk_captain_id=? where meeting_id=?';
        connection.query(update_sql, [user_id, meeting_id], (err, rows, fields) => {
            if(err){
                console.log(err);
                res.json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                //문의방 모임장 변경
                var update_inquiry_room = 'update chatroom set user_nick_name=? where meeting_id=? and is_member=1 and room=0';
                connection.query(update_inquiry_room, [user_nick_name, meeting_id], (err, rows, fields) => {
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
                            'message':'모임장 변경 성공'
                        });
                    }
                });
            }
        });
    });
}