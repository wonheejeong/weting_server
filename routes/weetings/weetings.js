module.exports = function(app, connection){
    //모임 전체 결과 조회 - 이름순 정렬

    app.get(['/weetings', '/weetings/:id'], (req, res)=>{
        if(req.session.logined){
            var id = req.params.id;
            //모임 상세 정보
            if(id){
                var select_sql = 'select * from meeting order by meeting_name asc';
                connection.query(select_sql, (err, rows, fields)=>{
                    if(err){
                        console.log(err);
                        res.json({
                            'state':500,
                            'message':'서버 에러'
                        });
                    }
                    else{
                        if(id > rows.length || rows.length == 0 || id == 0){
                            res.json({
                                'state':404,
                                'message':'모임 없음'
                            });
                        }
                        else{
                            res.json({
                                'state':200,
                                'message':'조회 성공',
                                'data':rows[id-1]
                            });
                        }
                    }
                });
            }
            else{
                //전체 결과 리스트
                var select_sql = 'select meeting_name, meeting_img from meeting order by meeting_name asc';
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
