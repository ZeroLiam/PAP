import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './../App.css';
import socketio from './../lib/ws_client';
import socketcli from 'socket.io-client';
import _ from 'lodash';

class Index extends Component {
  constructor(props){
    super(props);

    this.state = {
        data: {}
    }
  }

  componentDidMount(){
    let dtobj = {};
    socketio.on('connect', () => {
      console.log("socketio.id: " + socketio.id); // Generate ID of client
      //Change the id of client and send it to the server
      dtobj.id = socketio.id;
    });
    socketio.on('message', (data) =>{
      //Get Image and color from server
      dtobj.img = data.img;
      dtobj.color = data.color;
      console.log('user received: ' + dtobj.color);
      this.setState({data: dtobj});
    });
    socketio.on('disconnect', () =>{
      console.log('user disconnected');
    });
  }

  render() {

    return (
      <div>
        <h1>Here is the index. Checkout the network tab plz.</h1>
      </div>
    );
  }
}

export default Index;
