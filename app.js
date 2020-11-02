var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');
var publicRouter = require('./routes/public/');
var publicArticleRouter = require('./routes/public/article');
var publicProjectRouter = require('./routes/public/project');
var projectRouter = require('./routes/project');

const jwt = require('jsonwebtoken')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const authentication = () =>{
  app.set('Secret', 'asdasd');
      app.use((req, res, next) => {
          let token = req.headers['keys'];
          if (token) {
              jwt.verify(token, app.get('Secret'), (err, decoded) => {
                  if (err) {
                      return res.send({ success: false, error: 'Failed to authenticate token.' });
                  } else {
                      req.decoded = decoded;
                      next();
                  }
              });
          } else {
              return res.status(403).send({
                  error: 'No token provided.'
              });
          }
      });
}

app.use('/', indexRouter);
app.use('/public', publicRouter);
app.use('/public/article', publicArticleRouter);
app.use('/public/project', publicProjectRouter);
authentication()
app.use('/users', usersRouter);
app.use('/article', articleRouter);
app.use('/project', projectRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
