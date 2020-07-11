module.exports = function(app, connection){
    var Image = require('../Image/S3.js');
    var upload = Image();

    //모임 생성 페이지
    app.get('/newWeeting', (req, res)=>{
        var select_sql = 'SELECT interests_id, interests_name FROM meeting_interests';
        connection.query(select_sql, (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.staus(500).json({
                    'state':500,
                    'message': '모임 생성 페이지 접속 오류'
                })
            }
            else{
                res.status(200).json({
                    'state':200,
                    'message':'접속 성공'
                    });
            }
        });
    });

    //생성 모임 정보 전송
    app.post('/create', upload.single('meeting_img'), (req, res)=>{
        var body = req.body;
        var month = (body.month.length === 1) ? '0'+body.month : body.month;
        var day = (body.day.length === 1) ? '0'+body.day : body.day;
        var meeting_time = new Date().getFullYear().toString()+'-'+month+'-'+day;
        var queries = {
            'fk_meeting_interest':body.fk_meeting_interest,
            'fk_user_id':body.fk_user_id,
            'meeting_name':body.meeting_name,
            'meeting_description':body.meeting_description,
            'meeting_location':body.meeting_location,
            'meeting_recruitment':body.meeting_recruitment,
            'meeting_time':meeting_time,
            'age_limit_min':body.age_limit_min,
            'age_limit_max':body.age_limit_max,
            'meeting_img':req.file.location
        }
        var insert_sql = 'INSERT INTO meeting SET ?';
        connection.query(insert_sql, queries, (err, result, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message': '모임 생성 오류'
                })
            }
            else{
                var participant_insert_sql = 'INSERT INTO meeting_participants (fk_participant_user_id, fk_meeting_id) VALUES (?, ?)';
                connection.query(participant_insert_sql, [body.fk_user_id, result.insertId], (err, rows, fields)=>{
                    if(err){
                        console.log(err);
                        res.status(500).json({
                            'state':500,
                            'message':'모임원 추가 오류'
                        });
                    }
                    else{
                        res.status(200).json({
                            'state':200,
                            'meesage': '모임 생성 성공',
                        });
                    }
                });
            }
        });
    });
}