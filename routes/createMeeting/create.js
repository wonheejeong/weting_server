module.exports = function(app, connection){
    var Image = require('../Image/S3.js');
    var upload = Image('meeting_img/');

    //모임 생성 페이지
    app.get('/newWeeting', (req, res)=>{
        if(req.session.logined){
            res.json({
                'state':200,
                'message':'접속 성공'
            });
        }
        else{
            res.json({
                'state':300,
                'message':'로그아웃 상태'
            });
        }
    });

    //생성 모임 정보 전송
    app.post('/create', upload.single('meeting_img'), (req, res)=>{

        var user_email = req.session.user_email;
        var user_select_sql = 'SELECT user_id, user_nick_name FROM users WHERE user_email=?';
        connection.query(user_select_sql, [user_email], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                var user_id = rows[0].user_id;
                var user_nick_name = rows[0].user_nick_name;
                var meeting_img = (req.file == undefined) ? null : req.file.location;
                var body = req.body;

                var select_interest = 'select interests_id from meeting_interests where interests_name=?';
                connection.query(select_interest, [body.meeting_interest], (err, result, fields)=>{
                    if(err){
                        console.log(err);
                        res.json({
                            'state':500,
                            'message':'서버에러'
                        });
                    }
                    else{
                        if(result.length == 0){
                            res.json({
                                'state':404,
                                'message':'존재하지 않는 카테고리'
                            });
                        }
                        else{
                            var meeting_interest = result[0].interests_id;
                            var queries = {
                                'fk_meeting_interest':meeting_interest,
                                'fk_captain_id':user_id,
                                'meeting_name':body.meeting_name,
                                'meeting_description':body.meeting_description,
                                'meeting_location':body.meeting_location,
                                'meeting_recruitment':body.meeting_recruitment,
                                'meeting_time':body.meeting_time,
                                'age_limit_min':body.age_limit_min,
                                'age_limit_max':body.age_limit_max,
                                'meeting_img':meeting_img
                            }
                            var insert_sql = 'INSERT INTO meeting SET ?';
                            connection.query(insert_sql, queries, (err, result, fields)=>{
                                if(err){
                                    console.log(err);
                                    res.json({
                                        'state':500,
                                        'message': '모임 생성 오류'
                                    });
                                }
                                else{
                                    var participant_insert_sql = 'INSERT INTO meeting_participants (fk_participant_id, fk_meeting_id) VALUES (?, ?)';
                                    connection.query(participant_insert_sql, [user_id, result.insertId], (err, rows, fields)=>{
                                        if(err){
                                            console.log(err);
                                            res.json({
                                                'state':500,
                                                'message':'모임원 추가 오류'
                                            });
                                        }
                                        else{
                                            //채팅방 생성
                                            var create_chat_room = 'INSERT INTO chatroom (meeting_id, meeting_name, user_nick_name, is_member, room) VALUES (?, ?, ?, ?, ?)';
                                            connection.query(create_chat_room, [result.insertId, queries['meeting_name'], user_nick_name, 1, result.insertId], (err, rows, fields)=>{
                                                if(err){
                                                    console.log(err);
                                                    res.json({
                                                        'state':500,
                                                        'message':'채팅방 생성 오류'
                                                    });
                                                }
                                                else{
                                                    var create_inquiry_room = 'INSERT INTO chatroom (meeting_id, meeting_name, user_nick_name, is_member, room) VALUES (?, ?, ?, ?, ?)';
                                                    connection.query(create_inquiry_room, [result.insertId, queries['meeting_name'], user_nick_name, 1, 0], (err, rows, fields) => {
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
                                                                'message':'모임 생성 성공',
                                                                'data': {
                                                                    'meeting_id' : result.insertId,
                                                                    'meetine_name':queries['meeting_name'],
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}
