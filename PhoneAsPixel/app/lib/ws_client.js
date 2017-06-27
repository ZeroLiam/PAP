import config from './config';
const ws = new WebSocket("ws://" + config.host + ":" + config.port, config.protocol);
const uuidv4 = require('uuid/v4');

// var ws = config.staging.host;
// let id = uuidv4();//generates a random uuid so forget about it for now

ws.onopen = () => {
  // connection opened
  console.log("OPEN");
  ws.send('something'); // send a message
};

ws.onmessage = (e) => {
  // a message was received
  console.log("ONMESSAGE");
  console.log(e.data);
};

ws.onerror = (e) => {
  // an error occurred
  console.log("ONERROR");
  console.log(e.message);
};

ws.onclose = (e) => {
  // connection closed
  console.log("ONCLOSE");
  console.log(e.code, e.reason);
};

export default ws;
