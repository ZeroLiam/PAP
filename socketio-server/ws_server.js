var app = require('express')();
var http = require('http').Server(app);
var sockio = require('socket.io')(http);

//configure the connection for the server
const config = {
	host: '192.168.0.103',
	port: '3000',
	protocol: 'echo-protocol'
}

//Make the object for the devices and properties
var devObj = {};
var dataObj = {};
var tstImg = 'http://mediang.gameswelt.net/public/images/201606/7962b7e8b6aaf20d6c5900418335fcbb.jpg';

app.get('/', function(req, res){
  res.send('<h1>Setting up server</h1>');
});

sockio.on('connection', function(socketclient){
  console.log('a user connected:' + socketclient.id);
	devObj[socketclient.id] = {socket: socketclient};


	socketclient.on('joinimg', function(msg){
		console.log(msg);
		dataObj = {id: msg.id, connected: true, msg: 'I can see you Mr. ' + msg.id, img: tstImg};
			// devObj[socketclient.id].img = tstImg;
			// devObj[socketclient.id].connected = true;
			// devObj[socketclient.id].message = 'I can see you Mr. ' + msg.id;
			// console.log(dataObj);
			// devObj[socketclient.id].dtObj = dataObj;
			// devObj[socketclient.id] = {connected: true, msg: 'I can see you Mr. ' + msg.id};
	    // console.log('message: ' + msg.id);
			//sends data to specific id
			sockio.sockets.connected[socketclient.id].emit('message', dataObj);
			// console.log("Source img: " + devObj[socketclient.id].img);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});
