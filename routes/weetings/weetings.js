module.exports = function(app, connection){
    //전체 및 카테고리 별 모임 조회
    app.get(['/weetings', '/weetings/:category'], (req, res)=>{
        var category = req.params.category;
        if(req.session.logined){
            if(category){
                var select_interest_sql = 'select interests_id from meeting_interests where interests_name=?';
                connection.query(select_interest_sql, [category], (err, rows, fields)=>{
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
                                'message':'존재하지 않는 카테고리'
                            });
                        }
                        else{
                            var interest_id = rows[0].interests_id;
                            var select_meeting_sql = 'select meeting_id, meeting_name, meeting_img, meeting_location, meeting_time, meeting_recruitment from meeting where fk_meeting_interest =? order by meeting_name asc';
                            connection.query(select_meeting_sql, [interest_id], (err, rows, fields)=>{
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
                                        })
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
                    }
                });
            }
            else{
                var select_sql = 'select meeting_id, meeting_name, meeting_img, meeting_location, meeting_time, meeting_recruitment from meeting order by meeting_name asc';
                connection.query(select_sql, (err, rows, fields)=>{
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
