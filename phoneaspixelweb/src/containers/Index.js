import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './../App.css';
import socketio from './../lib/ws_client';

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
    socketio.on('setdata', (data) =>{
      //Get Image and color from server
      dtobj.img = data.img;
      dtobj.color = data.color;
      dtobj.connected = true;
      dtobj.posx = 0;
      dtobj.posy = 0;
      this.setState({data: dtobj});
      //emit to server this color and id
      socketio.emit('devices', dtobj);

    });
    socketio.on('disconnect', () =>{
      console.log('user disconnected');
    });

  }

  render() {
    //assign colors
    let viewPortWidth, viewPortHeight;
    if (typeof window.innerWidth != 'undefined') {
       viewPortWidth = window.innerWidth,
       viewPortHeight = window.innerHeight
     }

    let maindiv = {
      width: viewPortWidth,
      height: viewPortHeight,
      bgcolor: this.state.data.color
    }

    return (
      <div style={{backgroundColor: maindiv.bgcolor, width: maindiv.width, height: maindiv.height}}>
      </div>
    );
  }
}

export default Index;
