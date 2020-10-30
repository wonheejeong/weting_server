module.exports = function(io, app) {
    app.get('/chats/66/:user_nick_name', (req, res) => {
        var user_nick_name = req.params.user_nick_name;

        io.once('connection', (socket) => {
            console.log('user  connected');
            var chats = '새로운 멤버 ' + user_nick_name + ' 이/가 입장했습니다.\n';
            io.emit('new user', chats, user_nick_name);

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