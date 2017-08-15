import config from './config';
import SocketIOClient from 'socket.io-client';

// Creating the socket-client instance will automatically connect to the server.
const socketio = SocketIOClient('http://'+ config.host + ':' + config.port + '/');

export default socketio;
