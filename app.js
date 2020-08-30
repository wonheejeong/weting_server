var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config = require('./db_info.js').local;
var session = require('express-session');
const FileStore = require('session-file-store')(session);
var app = express();
const path = require('path');
var execPHP = require('./phpfiles/execphp.js')();

execPHP.phpFolder = './phpfiles';

app.use('*.php', function(req, res, next){
  execPHP.parseFile(req.originalUrl, function(phpResult){
    res.write(phpResult);
    res.end();
  });
});

app.use('/swagger-ui', express.static(path.join(__dirname, './node_modules/swagger-ui/dist')));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));
var connection = mysql.createConnection({
                    host: config.host,
                    port: config.port,
                    user: config.user,
                    password: config.password,
                    database: config.database,
                    multipleStatements: true
                });

connection.connect();

var port = process.env.PORT || 3000;
app.listen(port ,function(){
    console.log("Express server has started on port " + port);
});
// routes
// login
var loginRouter = require('./routes/login/login.js')(app,connection);
var joinRouter = require('./routes/login/join.js')(app,connection);

//myPage
var myPageRouter = require('./routes/myPage/myPage.js')(app,connection);
var contactRouter = require('./routes/myPage/contact.js')(app,connection);
var interestRouter = require('./routes/myPage/edit/interests.js')(app,connection);
var imageRouter = require('./routes/myPage/edit/image.js')(app,connection);
var passwordRouter = require('./routes/myPage/edit/password.js')(app,connection);
var introduceRouter = require('./routes/myPage/edit/introduce.js')(app,connection);


//recommend
var recommendRouter = require('./routes/recommend/recommend.js')(app,connection);

//create meeting
var NewWeetingRouter = require('./routes/createMeeting/create.js')(app, connection);

//main

var mainRouter = require('./routes/main/main.js')(app, connection);
//myWeeting
var myWeetingRouter = require('./routes/MyWeeting/myWeeting.js')(app, connection);

var myWeetingDeleteRouter = require('./routes/MyWeeting/myWeetingDelete.js')(app, connection);

var myWeetingUpdateRouter = require('./routes/MyWeeting/myWeetingUpdate.js')(app, connection);


//search 
var searchRouter = require('./routes/search/search.js')(app, connection);

var fullCategoryRouter = require('./routes/search/fullCategory.js')(app, connection);

var searchResultRouter = require('./routes/search/searchResult.js')(app, connection);

//weetings
var weetingsRouter = require('./routes/weetings/weetings.js')(app, connection);

var weetingDetailRouter = require('./routes/weetings/weetingDetail.js')(app, connection);

var weetingParticipateRouter = require('./routes/participate/participate.js')(app, connection);