module.exports = function(app, connection)
{
  app.get('/login', function(req, res){
    console.log('get /login');
    res.end('Hello World');
  })
}
