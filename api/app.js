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

const events = [
  {text: 'SMOKE IN BUILDING', event: 'FIRE + EMT'},
  {text: 'MOTOR VEHICLE ACCIDENT', event: 'FIRE + EMT'},
  {text: 'RESIDENTIAL FIRE', event: 'FIRE + EMT'},
  {text: 'RESIDENTIAL FIRE',event: 'FIRE + EMT'},
  {text: 'Someone has pitched a tent in the woods near the creek.', event: 'POLICE'},
  {text: 'Caller states $2,000 stolen from wheel well of car.', event: 'POLICE'},
  {text: 'Two men took man\'s leafblower and green jacket. Dropped blower but still have jacket.', event: 'POLICE'}
]
const getEvent = () => events[getRandomInRange(0, events.length - 1, 0)];

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
    const event = getEvent();
    socket.broadcast.emit('sent coordinates', {
      coords: { lat: getRandomInRange(19.50139, 64.85694, 7), long: getRandomInRange(-161.75583, -68.01197, 7)},
      event: event.event,
      text: event.text,
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