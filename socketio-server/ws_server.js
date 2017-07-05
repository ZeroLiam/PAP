var app = require('express')();
var http = require('http').Server(app);
var sockio = require('socket.io')(http);
var _ = require('lodash');

//configure the connection for the server
const config = {
	host: '192.168.0.101',
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

///Generate a random preset color for each client
//This is for the demo, using tracking JS
function getRandomPresetColor() {
	var colors = ['magenta', 'cyan'];
	var color = colors[Math.floor(Math.random() * 2)];
	return color;
}

app.get('/', function(req, res){
  res.send('<h1>Setting up server</h1>');
});

let minions = [];

sockio.on('connection', function(socketclient){
	minions.push(socketclient);

  console.log('a user connected:' + socketclient.id);
	devObj[socketclient.id] = {socket: socketclient};
	dataObj = {
		id: socketclient.id,
		color: getRandomPresetColor(),
		connected: true,
		msg: 'I can see you Mr. ' + socketclient.id,
		img: tstImg
	};
	//sends the generated data to specific id
	sockio.sockets.connected[socketclient.id].emit('setdata', dataObj);

		//do we have a list of colors and ids?
		console.log("length: " + sockio.engine.clientsCount);

		socketclient.on('disconnect', () => {
				console.log('Got disconnect! ' + socketclient.id);

				//trace back update on connected minions
				for(let px = 0; px < clientObj.length; px++){
					if(clientObj[px].id == socketclient.id){
						console.log("I SHOULD POP THIS GUY --> " + clientObj[px].id);
						clientObj.splice(px, 1);
					}
				}

	      let i = minions.indexOf(socketclient);
	      minions.splice(i, 1);

				//sends all the updated minions to BigBro™
				sockio.emit('getcolors', clientObj);
		});

		// Get the data from all the minions
		socketclient.on('devices', function(data){
				//Only phones will send this event
				for(let px = 0; px < minions.length; px++){
					if(data.id == minions[px].id){
						clientObj.push(data);
					}
				}
				//sends all the minions to BigBro™
				sockio.emit('getcolors', clientObj);
		});

		socketclient.on("dummy", function(data){
			console.log("WE ARE DUMMY");
			console.log(data);
		});

});


http.listen(config.port, function(){
  console.log('listening on *: ' + config.port);
});
