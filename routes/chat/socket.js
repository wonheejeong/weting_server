module.exports = function(io, app, connection) {
    app.get('/chats/66/hh', (req, res) => {
        //var user_nick_name = req.params.user_nick_name;

        io.once('connection', (socket) => {
            //socket.name = user_nick_name;
            console.log('user  connected');
            var chats = '새로운 멤버 ' + 'hh' + '이/가 입장했습니다.\n';
            io.emit('new user', chats, 'hh');

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            
            socket.on('send message', (text) => {
                var msg = hh + ' : ' + text;
                io.emit('receive message', msg);
            });
        });
        res.render('chats');
    });
}