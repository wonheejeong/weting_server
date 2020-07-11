module.exports = function(app, connection){
    var Image = require('../Image/S3.js');
    var upload = Image();

    app.get('/MyweetingUpdate/:id', (req, res)=>{
        var id = req.params.id;
        var select_sql = 'SELECT * FROM meeting WHERE meeting_id=?';
        connection.query(select_sql, [id], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state': 500,
                    'message': '서버 에러'
                });
            }
            else{
                if(rows.length == 0){
                    res.status(404).json({
                        'state':404,
                        'message':'존재하지 않는 모임'
                    })
                }
                else{
                    res.status(200).json({
                        'state':200,
                        'message' : '모임 조회 성공'
                    });
                }
            }
        });
    });

    app.post('/myWeetingUpdate/:id', upload.single('meeting_img'), (req, res)=>{
        var id = req.params.id;
        var select_sql = 'SELECT meeting_id FROM meeting WHERE meeting_id=?';
        connection.query(select_sql, [id], (err, rows, fields)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    'state':500,
                    'message':'서버 에러'
                });
            }
            else{
                if(rows.length == 0){
                    res.status(404).json({
                        'state':404,
                        'message':'존재하지 않는 모임'
                    })
                }
                else{
                    var body = req.body;
                    var month = (body.month.length == 1) ? '0'+body.month : body.month;
                    var day = (body.day.length == 1) ? '0'+body.day : body.day;
                    var meeting_time = new Date().getFullYear().toString()+'-'+month+'-'+day;
                    if(req.file == undefined){
                        var meeting_img = body.before_img
                    }
                    else{
                        var meeting_img = req.file.location
                    }
                    var update_sql = 'UPDATE meeting SET fk_meeting_interest=?, meeting_name=?, meeting_description=?, meeting_location=?, meeting_recruitment=?, meeting_time=?, age_limit_min=?, age_limit_max=?, meeting_img=? WHERE meeting_id=?';
                    connection.query(update_sql, [body.fk_meeting_interest, body.meeting_name, body.meeting_description, body.meeting_location, body.meeting_recruitment, meeting_time, body.age_limit_min, body.age_limit_max, meeting_img, id], (err, rows, fields)=>{
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                'state':500,
                                'message':'서버 에러'
                            })
                        }
                        else{
                            res.status(200).json({
                                'state':200,
                                'message' : '수정 성공'
                            })
                        }
                    });
                }
            }
        });
    });
}