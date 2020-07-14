module.exports = function(app, connection)
{

    app.get('/recommend', function(req, res){
        console.log('get /recommend');
        var user_email = req.session.user_email;
        if(req.session.logined){
            var sql = 'SELECT user_interests FROM users WHERE user_email = ?;';
            connection.query(sql, user_email, function(error,results,fields){
                if (error) {
                    res.json({
                    'state': 400,
                    'message': "통신 실패"
                    });
                    console.log(error);
                } else {
                    var interests = results[0].user_interests.split('/');
                    for (var i in interests){
                        interests[i] = JSON.stringify(interests[i]);
                    }
                    
                    var sql = 'SELECT m.* FROM meeting as m JOIN meeting_interests as mi ON m.fk_meeting_interest= mi.interests_id WHERE mi.interests_name IN ('
                            +interests.join()+') LIMIT 20;';
                    connection.query(sql, interests, function(error,results,fields){
                        if(error){
                            res.json({
                                'state': 400,
                                'message': "통신 실패"
                                });
                            console.log(error);
                        }else{
                            res.json({
                                "state":200,
                                "message":"관심사 추천 성공",
                                "list": results
                            });
                        }

                    });
                    
                    
                }
            });
        }else{
            res.json({
                'state': 300,
                'message': "로그아웃 상태"
                });
        }
    });


}