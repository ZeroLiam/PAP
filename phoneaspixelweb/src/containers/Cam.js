import React, { Component } from 'react';
import './../App.css';
import socketio from './../lib/ws_client';
import socketcli from 'socket.io-client';
import tracking from 'tracking';
import _ from 'lodash';


class Cam extends Component {
  constructor(props){
    super(props);

    let video = null;
    let camera = null;
    let contxt = null;

    this.state = {
        data: {}
    }
  }

  componentDidMount(){
    let clientdt = {};
    socketio.on('connect', () => {
      console.log("socketio.id: " + socketio.id); // Generate ID of client
      //Change the id of client and send it to the server
      clientdt.id = socketio.id;
    });
    socketio.on('getcolors', (dt) =>{
      console.log(data);
      //Get Image and color from server
      // clientdt.id = data.id;
      // clientdt.color = data.color;
      // clientdt.img = data.img;

      // console.log('user received: ' + clientdt.color);
      this.setState({data: dt});
    });
    socketio.on('disconnect', () =>{
      console.log('user disconnected');
    });
  }

  camtrack(){
      let tracker = new tracking.ColorTracker();
      console.log("this.state");
      console.log(this.state.data.id);
        // let colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
  }


  render() {

    this.camtrack();
    let camstyle = {
      videocam: {
        marginLeft: '100px',
        marginTop: '35px',
        position: 'absolute'
      }
    }

    return (
      <div>
        <h1>Camera driver</h1>
        <div>
            <video style={camstyle.videocam} ref={(vid) => { this.video = vid; }} width="600" height="450" preload autoPlay loop muted controls></video>
            <canvas style={camstyle.videocam}  ref={(cam) => { this.camera = cam; }} width="600" height="450"></canvas>
        </div>
      </div>
    );
  }
}

export default Cam;
