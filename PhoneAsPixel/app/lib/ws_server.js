var express = require('express');
var http = require('http')
var socketio = require('socket.io');
const config = {
	host: '192.168.0.100',
	port: '3000',
	protocol: 'echo-protocol'
}

var app = express();
var server = http.Server(app);
var websocket = socketio(server);
server.listen(config.port, () => console.log('listening on *: ' + config.port));

// The event will be called when a client is connected.
websocket.on('connection', (socket) => {
  console.log('A client just joined on', socket.id);
});

websocket.on('channel-name', (message) => {

  // The `broadcast` allows us to send to all users but the sender.
  websocket.broadcast.emit('channel-name', message);
});
