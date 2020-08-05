module.exports = function(app, connection){
    //모임 전체 결과 조회 - 이름순 정렬

    app.get(['/weetings', '/weetings/:id'], (req, res)=>{
        if(req.session.logined){
            // id = 모임ID
            var id = req.params.id;
            //모임 상세 정보
            if(id){
                var select_sql = 'select meeting.*, users.user_nick_name from meeting join users on meeting.fk_captain_id = users.user_id where meeting_id=? order by meeting_name asc';
                connection.query(select_sql, [id], (err, rows, fields)=>{
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
                                'state':404,
                                'message':'모임 없음'
                            });
                        }
                        else{
                            res.json({
                                'state':200,
                                'message':'조회 성공',
                                'data':rows
                            });
                        }
                    }
                });
            }
            else{
                //전체 결과 리스트
                var select_sql = 'select meeting_name, meeting_img, meeting_location, meeting_time, meeting_recruitment from meeting order by meeting_name asc';
                connection.query(select_sql, (err, rows, fields)=>{
                    if(err){
                        console.log(err);
                        res.json({
                            'state':500,
                            'message':'서버 에러',
                        });
                    }
                    else{
                        res.json({
                            'state':200,
                            'message':'조회 성공',
                            'data':rows
                        });
                    }
                });
            }
        }
        else{
            res.json({
                'state':300,
                'message':'로그아웃 상태'
            });
        }
    });
}
