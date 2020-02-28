var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'editor.md')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: olConfig.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { user: "default" }
}));

var indexPath = olConfig.indexPath;
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var shellRouter = require('./routes/shell');
var hexoRouter = require('./routes/hexo');
var postRouter = require('./routes/post');
var getPostRouter = require('./routes/getPost');
var pageRouter = require('./routes/page');
var getPageRouter = require('./routes/getPage');

app.use(indexPath, indexRouter);
app.use(indexPath + 'login', loginRouter);
app.use(indexPath + 'logout', logoutRouter);
app.use(indexPath + 'shell', shellRouter);
app.use(indexPath + 'hexo', hexoRouter);
app.use(indexPath + 'post', postRouter);
app.use(indexPath + 'getPost', getPostRouter);
app.use(indexPath + 'page', pageRouter);
app.use(indexPath + 'getPage', getPageRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
