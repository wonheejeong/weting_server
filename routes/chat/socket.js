module.exports = function(io, app) {
    app.get('/chats/66/:user_nick_name', (req, res) => {
        var name = req.params.user_nick_name;

        io.on('connection', function(socket){ 
            socket.name = name;
            console.log('user connected: ', socket.id);                  
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
        res.render('chats');
    });
}