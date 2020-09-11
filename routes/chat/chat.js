module.exports = function(io, app, connection){
    app.get('/chat', (req, res)=> {
        if(req.session.logined){
            var user_email = req.session.user_email;
            var select_sql = 'select user_nick_name from users where user_email=?';
            connection.query(select_sql, [user_email], (err, rows, fields)=>{
                if(err){
                    res.json({
                        'state': 500,
                        'message': '서버 에러'
                    });
                }
                else{
                    //function 매개변수 socket = 클라이언트와 연결되어 있는 socket 관련 정보들
                    io.on('connection', function(socket){ 
                        console.log('user connected: ', socket.id);  
                        var name = rows[0].user_nick_name;
                        socket.name = name;
                        io.to(socket.id).emit('create name', name);   
                        
                        socket.on('disconnect', function(){ 
                          console.log('user disconnected: '+ socket.id + ' ' + socket.name);
                        });
                    
                        socket.on('send message', function(name, text){ 
                            var msg = name + ' : ' + text;
                            socket.name = name;
                            console.log(msg);
                            io.emit('receive message', msg);
                        });
                    });  
                    res.render('chat'); 
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