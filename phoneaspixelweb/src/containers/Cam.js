import React, { Component } from 'react';
import './../App.css';
import socketio from './../lib/ws_client';
import tracking from 'tracking';
import _ from 'lodash';


class Cam extends Component {
  constructor(props){
    super(props);

    let video = null;
    let camera = null;
    let contxt = null;

    this.state = {
        data: []
    }
  }

  componentDidMount(){
    socketio.on('connect', () => {
      console.log("socketio.id: " + socketio.id); // Generate ID of client
      //Change the id of client and send it to the server
      // clientdt.id = socketio.id;
      socketio.on('getcolors', (dt) =>{
        this.setState({data: dt});
      });
    });
    socketio.on('disconnect', () =>{
      console.log('user disconnected');
    });
  }

  camtrack(){
      let tracker = new tracking.ColorTracker();
      console.log("this.state");
      console.log(this.state);
      let allColors = [];
      let newColorNames = [];
      //Change colors each time we get a new set of colors
      _.forEach(this.state.data, (value, key)=>{
        console.log(value.id + " " + value.color);
        let newColor = this.convertToRGB(value.color);
        newColorNames.push(value.id);

        tracking.ColorTracker.registerColor(value.id, function(r, g, b) {
          if (r < newColor[0] && g > newColor[1] && b < newColor[2]) {
            return true;
          }
          return false;
        });
      });

        let colors = new tracking.ColorTracker(newColorNames);
        tracking.track('#video', tracker, { camera: true });
  }

  convertToRGB(color){
    //We start in 1 because the # sign is on 0 position.
    let r = color.slice(1,3);
    let g = color.slice(3,5);
    let b = color.slice(5,7);
    let newr = parseInt(r, 16);
    let newg = parseInt(g, 16);
    let newb = parseInt(b, 16);
    let newrgb = [newr, newg, newb];

    return newrgb;

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
            <video id="video" style={camstyle.videocam} ref={(vid) => { this.video = vid; }} width="600" height="450" preload autoPlay loop muted controls></video>
            <canvas id="canvas" style={camstyle.videocam}  ref={(cam) => { this.camera = cam; }} width="600" height="450"></canvas>
        </div>
      </div>
    );
  }
}

export default Cam;
