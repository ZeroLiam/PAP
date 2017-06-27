import config from './config';
import SocketIOClient from 'socket.io-client';

// Creating the socket-client instance will automatically connect to the server.
const websocket = SocketIOClient('http://'+ config.host + ':' + config.port);

websocket.on('connect', () => {
  console.log(websocket.id); // 'G5p5...'
});

export default websocket;
