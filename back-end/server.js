var express = require('express');
var app = express();

var http = require('http') //websockets testing

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
// var port = process.env.PORT || 8000;
//var User = require('./models/user');
var config = require('./config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var morgan = require('morgan');

// the below is a fix for socket from stack overflow

app.set('port', process.env.PORT || 8100);

app.use(express.static(path.join(__dirname, "../", "public")));
//app.use(express.static(path.join(__dirname, "../", "getMe/www")));

var server = http.createServer(app);
var io = require('socket.io').listen(server);


//var io = require('socket.io')(http); //websockets testing 


app.use(bodyParser.json());

app.use("/api", expressJwt({
    secret: config.secret
}));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use('/auth', require('authRoutes'))
// app.use('/api/user', require('../getMe/www/js/userRoutes'))
// app.use('/api/conversation', require('../getMe/www/js/conversationRoutes'))
// app.use('/api/message', require('../getMe/www/js/messageRoutes'))


app.use('/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/conversation', require('./routes/conversationRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));
// websockets testing//

io.on('connection', function (socket) {
    io.sockets.on('connection', function (socket) {
        console.log("user has joined the socket");
        console.log(socket.adapter.rooms);

        socket.on('create', function (room) {
            console.log('user has created a room');
            socket.join(room);
            console.log(room)
        });

        socket.on('join', function (room) {
            socket.join(room);
            console.log("A user has joined a room")
        });

    });

    socket.on('chat message', function (data) {
        console.log(data.message);
        io.sockets.in(data.room).emit('chat message', data.message);
    });

    socket.on("disconnect", function () {
        console.log('user has disconnected from room')
    });

    socket.on('sound play', function(data){
        console.log(data);
        console.log(io.sockets)
    })


});

/////////////////////

mongoose.connect(config.database, function () {
    console.log("connected to the database")
})

server.listen(app.get('port'));

//app.listen(port, function(){
//    console.log("Server is listening on port " + port)
//})