var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const config = {
	host: '192.168.0.103',
	port: '3000',
	protocol: 'echo-protocol'
}

app.get('/', function(req, res){
  res.send('<h1>Setting up server</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected:');
	socket.on('joinimg', function(msg){
    console.log('message: ' + msg.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
