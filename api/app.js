var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// python3 speechToText.py https://broadcastify.cdnstream1.com/31035 --speech_key ef658ef9e4364e8cafba698552b6ec06

app.post('/upload', upload.single('soundfile'), function (req, res, next) {
  // req.file
  console.log('do something with the upload')

  return res.sendStatus(200)
})

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


io.on('connection', (socket) => {
  console.log('a user connected');
  setInterval(() => {
    socket.broadcast.emit('sent coordinates', {
      coords: { lat: getRandomInRange(-90, 90, 7), long: getRandomInRange(-180, 180, 7)},
      event: 'FIRE + EMT',
      text: '(SAINT LOUIS - ) DELAYED: SLMPD ON SCENE OF A PEDESTRIAN STRUCK BY A VEHICLE, DECEASED. DRIVER FLED. [MOU016]',
      streamUrl: 'https://www.broadcastify.com/listen/feed/17925/web'
    })

  }, 3000)
})

http.listen(8081, () => {
  console.log('accepting connections on *:8081');
})

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}