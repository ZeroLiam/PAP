import config from './config';
let hostname = "127.0.0.1";
let port = "3000";
const ws = new WebSocket("ws://" + hostname + ":" + port + "/echo/websocket");

// var ws = config.staging.host;

ws.onopen = () => {
  // connection opened
  console.log("OPEN");
  // ws.send('something'); // send a message
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
