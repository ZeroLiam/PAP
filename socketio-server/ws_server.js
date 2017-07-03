var app = require('express')();
var http = require('http').Server(app);
var sockio = require('socket.io')(http);
var _ = require('lodash');

//configure the connection for the server
const config = {
	host: '192.168.0.103',
	port: '3001',
	protocol: 'echo-protocol'
}

//Make the object for the devices and properties
var devObj = {};
var dataObj = {};
var clientObj = [];
var tstImg = 'http://mediang.gameswelt.net/public/images/201606/7962b7e8b6aaf20d6c5900418335fcbb.jpg';

//Generate a random color for each client
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

app.get('/', function(req, res){
  res.send('<h1>Setting up server</h1>');
});

sockio.on('connection', function(socketclient){
  console.log('a user connected:' + socketclient.id);
	devObj[socketclient.id] = {socket: socketclient};
	dataObj = {
		id: socketclient.id,
		color: getRandomColor(),
		connected: true,
		msg: 'I can see you Mr. ' + socketclient.id,
		img: tstImg
	};
	//sends the generated data to specific id
	sockio.sockets.connected[socketclient.id].emit('setdata', dataObj);

		//do we have a list of colors and ids?
		console.log("length: " + sockio.engine.clientsCount);
		// console.log(sockio);

		//Get the data from all the minions
		socketclient.on('devices', function(data){
				//Only phones will send this event
				// clientObj.push(data);
				console.log(sockio.sockets.clients().adapter.nsp.connected);
				//sends all the minions to BigBro™
				// sockio.emit('getcolors', data);
		});

});


http.listen(config.port, function(){
  console.log('listening on *: ' + config.port);
});
