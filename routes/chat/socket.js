module.exports = function(io, app) {
    app.get('/chats/66/:user_nick_name', (req, res) => {
        var user_nick_name = req.params.user_nick_name;

        io.once('connection', (socket) => {
            console.log('user ' + user_nick_name + ' connected');
            io.to(socket.id).emit('create name', user_nick_name);

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            
            socket.on('send message', (user_nick_name, text) => {
                var msg = user_nick_name + ' : ' + text;
                io.emit('receive message', msg);
            });
        });
        res.render('chats');
    });
}