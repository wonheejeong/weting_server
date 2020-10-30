module.exports = function(io, app) {
    app.get('/socket', (req, res) => {
        io.once('connection', (socket) => {
            var name = '익명';
            socket.name = name;
            console.log('socket ' + socket.name + ' connected');

            //socket 연결 해제
            socket.on('disconnect', () => {
                console.log('user ' + socket.name +  ' leaved');
            });
          
            //메시지 전송
            socket.on('send message', (name, text) => {
                var msg = name + ' : ' + text;
                io.emit('receive message', msg);
            });
        });
    });
}