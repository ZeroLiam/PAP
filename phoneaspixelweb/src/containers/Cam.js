import React, { Component } from 'react';
import './../App.css';
import socketio from './../lib/ws_client';
import dat from './../../node_modules/dat.gui/build/dat.gui.js';
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
        // this.setState({data: dt});
        this.camtrack(dt);
      });
    });
    socketio.on('disconnect', () =>{
      console.log('user disconnected');
    });
      //setup the tracking for the colors
      // this.camtrack();
  }

  camtrack(client){

      let tracker = new tracking.ColorTracker();

      let trackedColors = {
        custom: false
      };
      Object.keys(tracking.ColorTracker.knownColors_).forEach(function(color) {
        trackedColors[color] = true;
        console.log(trackedColors[color]);
      });
/*
      // console.log("client");
      // console.log(client);
      // let allColors = [];
      // let newColorNames = [];
      // let colors = new tracking.ColorTracker(); */
       //Change colors each time we get a new set of colors
      _.forEach(client, (value, key)=>{
        console.log(value.id + " " + value.color);
        // let newColor = this.convertToRGB(value.color);
        // newColorNames.push(value.id);
        // console.log("value.id");
        // console.log(value.id);
        // let r = newColor[0];
        // let g = newColor[1];
        // let b = newColor[2];
      });

      //   console.log("COLORS");
      //   console.log(newColorNames[0]);
      // console.log(tracking.ColorTracker().getColor(newColorNames[0]));

        // let colors = new tracking.ColorTracker(['magenta', 'cyan']);
        // let modClient = client;
        // console.log(modClient);
        // let dummy = {
        //   cyanx: 0,
        //   cyany: 0,
        //   magx: 0,
        //   magy:0
        // };

        // colors.on('track', (event)=> {
        //   this.contxt = this.refs.camera.getContext('2d');
        //   this.canvas = this.refs.camera;
        //   this.contxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //
        //   event.data.forEach((rect) =>{
        //     if (rect.color === 'custom') {
        //       rect.color = tracker.customColor;
        //     }
        //
        //     this.contxt.strokeStyle = rect.color;
        //     this.contxt.strokeRect(rect.x, rect.y, rect.width, rect.height);
        //     this.contxt.font = '11px Helvetica';
        //     this.contxt.fillStyle = "#fff";
        //     this.contxt.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        //     this.contxt.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        //     console.log('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        //
        //     for(let op = 0; op < modClient.length; op++){
        //         if(rect.color == 'cyan'){
        //           dummy.cyanx = rect.x;
        //           dummy.cyany = rect.y;
        //           modClient[op].posx = rect.x;
        //           modClient[op].posy = rect.y;
        //         }
        //         if(rect.color == 'magenta'){
        //           dummy.magx = rect.x;
        //           dummy.magy = rect.y;
        //           modClient[op].posx = rect.x;
        //           modClient[op].posy = rect.y;
        //         }
        //     }
        //   });
        // });
        //
        // let trackerTask = tracking.track('#video', colors, { camera: true });
        // window.setTimeout(()=>{
        //   trackerTask.stop();
        //
        //   socketio.emit("dummy", modClient);
        //
        //
        // }, 2500);

      //  initGUIControllers(tracker);
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

  createCustomColor(value, name, tracker) {
    let components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    let customColorR = parseInt(components[1], 16);
    let customColorG = parseInt(components[2], 16);
    let customColorB = parseInt(components[3], 16);

    let colorTotal = customColorR + customColorG + customColorB;

    if (colorTotal === 0) {
      tracking.ColorTracker.registerColor(name, (r, g, b) => {
        return r + g + b < 10;
      });
    } else {
      let rRatio = customColorR / colorTotal;
      let gRatio = customColorG / colorTotal;

      tracking.ColorTracker.registerColor(name, (r, g, b) => {
        let colorTotal2 = r + g + b;

        if (colorTotal2 === 0) {
          if (colorTotal < 10) {
            return true;
          }
          return false;
        }

        let rRatio2 = r / colorTotal2,
          gRatio2 = g / colorTotal2,
          deltaColorTotal = colorTotal / colorTotal2,
          deltaR = rRatio / rRatio2,
          deltaG = gRatio / gRatio2;

        return deltaColorTotal > 0.9 && deltaColorTotal < 1.1 &&
          deltaR > 0.9 && deltaR < 1.1 &&
          deltaG > 0.9 && deltaG < 1.1;
      });
    }

    this.updateColors(tracker);
  }

  updateColors(tracker) {
    let colors = [];

    for (let color in trackedColors) {
      if (trackedColors[color]) {
        colors.push(color);
      }
    }

    tracker.setColors(colors);
  }

  render() {
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
            <canvas id="canvas" style={camstyle.videocam}  ref="camera" width="600" height="450"></canvas>
        </div>
      </div>
    );
  }
}

export default Cam;
