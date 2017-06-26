import config from './config.js';
// const WebSocket = require('ws');
const ws = new WebSocket('ws://' + config.host + ':' + config.port);

ws.onopen = () => {
  // connection opened
  ws.send('fkbsdfj');
};

ws.onmessage = (e) => {
  // a message was received
  console.log(e.data);
};

ws.onerror = (e) => {
  // an error occurred
  console.log(e.message);
};

ws.onclose = (e) => {
  // connection closed
  console.log(e.code, e.reason);
};

export default ws;
