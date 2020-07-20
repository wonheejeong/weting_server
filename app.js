var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config = require('./db_info.js').local;
var session = require('express-session');
const FileStore = require('session-file-store')(session);
var app = express();
const path = require('path');
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

//recommend
var interestRouter = require('./routes/recommend/interests.js')(app,connection);
var recommendRouter = require('./routes/recommend/recommend.js')(app,connection);

//create meeting
var NewWeetingRouter = require('./routes/createMeeting/create.js')(app, connection);

//my page
var myWeetingRouter = require('./routes/MyWeeting/myWeeting.js')(app, connection);

var myWeetingDetailRouter = require('./routes/MyWeeting/myWeetingDetail.js')(app, connection);

var myWeetingDeleteRouter = require('./routes/MyWeeting/myWeetingDelete.js')(app, connection);

var myWeetingUpdateRouter = require('./routes/MyWeeting/myWeetingUpdate.js')(app, connection);

var myWeetingMembersRouter = require('./routes/MyWeeting/myWeetingMembers.js')(app, connection);

//search 
var searchRouter = require('./routes/search/search.js')(app, connection);

var moreCategoryRouter = require('./routes/search/moreCategory.js')(app, connection);

var categoryRouter = require('./routes/search/category.js')(app, connection);