module.exports = function(io, app, connection) {
    app.get('/chats/66/:user_nick_name', (req, res) => {
        var user_nick_name = req.params.user_nick_name;

        io.once('connection', (socket) => {
            socket.name = user_nick_name;
            console.log('user ' + socket.name + ' connected');
            var chats = '새로운 멤버 ' + socket.name + '이/가 입장했습니다.\n';
            io.emit('new user', chats, user_nick_name);

            socket.on('disconnect', () => {
                console.log('user ' + socket.name + ' disconnected');
            });
            
            socket.on('send message', (user_nick_name, text) => {
                socket.name = user_nick_name;
                var msg = socket.name + ' : ' + text;
                io.emit('receive message', msg);
            });
        });
        res.render('chats');
    });
}