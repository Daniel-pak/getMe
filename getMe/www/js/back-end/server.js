var express = require('express');
var app = express();

var http = require('http') //websockets testing
var morgan = require("morgan");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
//var port = process.env.PORT || 8000;
var User = require('./models/user');
var config = require('./config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
//var argscheck = require('cordova/argscheck');
//var exec = require('cordova/exec');

// the below is a fix for socket from stack overflow

app.set('port', process.env.PORT || 8100);
app.use(morgan("dev"));

//app.use(express.static(path.join(__dirname, "../", "public")));
app.use(express.static(path.join(__dirname, "../", "getMe/www")));

var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(bodyParser.json());

app.use("/api", expressJwt({
  secret: config.secret,
  credentialsRequired: false
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/conversation', require('./routes/conversationRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));


//websockets
io.on('connection', function (socket) {
  io.sockets.on('connection', function (socket) {
    console.log("user has joined the socket")
    socket.on('create', function (room) {
      console.log('user has created a room')
      socket.join(room);
    });
  });
  socket.on('chat message', function (data) {
    console.log(socket); //this is a test to console log the socket
    io.sockets.in(data.room).emit('chat message', data);
  });
  socket.on("disconnect", function () {
    console.log('user has disconnected from room')
  });
  // io.to(socketid).emit('message', 'for your eyes only');
});
/////////////////////

mongoose.connect(config.database, function (err) {
  if (err) throw err;
  console.log("connected to the database")
});

server.listen(app.get('port'), function () {
  console.log("Server is listening on port " + app.get("port"));
});

