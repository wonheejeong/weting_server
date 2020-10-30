module.exports = function(io, app) {
    app.get('/chats/66/:user_nick_name', (req, res) => {
        var user_nick_name = req.params.user_nick_name;

        io.once('connection', (socket) => {
            console.log('user ' + user_nick_name + ' connected');
            var chats = '새로운 멤버 ' + user_nick_name + ' 이/가 입장했습니다.\n';
            io.to(socket.id).emit('create name', user_nick_name);
            io.emit('new user', chats);

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