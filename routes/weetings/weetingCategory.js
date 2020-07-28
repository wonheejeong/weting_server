module.exports = function(app, connection){
    // 카테고리 별 모임 결과 조회 - 이름순 정렬

    app.get(['/weeting/:category', '/weeting/:category/:id'], (req, res)=>{
        if(req.session.logined){
            var category = req.params.category;
            var id = req.params.id;
            if(id){
                //모임 상세 정보
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
                        var select_meeting_sql = 'select * from meeting where fk_meeting_interest =? order by meeting_name asc';
                        connection.query(select_meeting_sql, [interests_id], (err, rows, fields)=>{
                            if(err){
                                console.log(err);
                                res.json({
                                    'state':500,
                                    'message':'서버 에러'
                                });
                            }
                            else{
                                if(rows.length == 0 || id > rows.length || id==0){
                                    res.json({
                                        'state':404,
                                        'message':'모임 없음'
                                    });
                                }
                                else{
                                    res.json({
                                        'state':200,
                                        'message':'조회 성공',
                                        'data': rows[id-1]
                                    });
                                }
                            }
                        });
                    }
                });
            }
            else{
                //전체 결과
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
                        var select_meeting_sql = 'select meeting_name, meeting_img from meeting where fk_meeting_interest=? order by meeting_name asc';
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
        else{
            res.json({
                'state':300,
                'message':'로그아웃 상태'
            });
        }
    });
}