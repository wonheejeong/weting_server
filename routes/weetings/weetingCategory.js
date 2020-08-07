module.exports = function(app, connection){
    // 카테고리 별 모임 결과 조회 - 이름순 정렬

    app.get(['/weeting/:category', '/weeting/:category/:id'], (req, res)=>{
        if(req.session.logined){
            // id = 모임ID
            var category = req.params.category;
            var id = req.params.id;
            //카테고리 존재여부 확인
            var select_interest_id = 'select interests_id from meeting_interests where interests_name=?';
            connection.query(select_interest_id, [category], (err, rows, fields)=>{
                if(err){
                    res.json({
                        'state':500,
                        'message':'서버 에러'
                    });
                }
                else{
                    if(rows.length == 0){
                        res.json({
                            'state':404,
                            'message':'존재하지 않는 카테고리'
                        });
                    }
                    else{
                        if(id){
                            //해당 카테고리의 모임 상세 정보 조회 - 전체 정보 조회
                            var select_sql = 'select meeting.*, users.user_nick_name as captain_nick_name from meeting join users on meeting.fk_captain_id = users.user_id where meeting_id=? order by meeting_name asc';
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
                                            'message':'존재하지 않는 모임'
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
                            //해당 카테고리 모임 전체 결과
                            var select_sql = 'select interests_id from meeting_interests where interests_name=?';
                            connection.query(select_sql, [category], (err, rows, fields)=>{
                                if(err){
                                    console.log(err);
                                    res.json({
                                        'state':500,
                                        'message':'서버 에러'
                                    });
                                }
                                else{
                                    var interests_id = rows[0].interests_id;
                                    var select_meeting_sql = 'select meeting_id, meeting_name, meeting_img, meeting_location, meeting_time, meeting_recruitment from meeting where fk_meeting_interest=? order by meeting_name asc';
                                    connection.query(select_meeting_sql, [interests_id], (err, rows, fields)=>{
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
                                                    'message':'해당 카테고리 모임 없음'
                                                });
                                            }
                                            else{
                                                res.json({
                                                    'state':200,
                                                    'message':'조회 성공',
                                                    'data' : rows
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
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
}