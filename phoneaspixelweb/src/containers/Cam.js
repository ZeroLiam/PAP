import React, { Component } from 'react';
import './../App.css';
import Uploader from './../components/Uploader';
import tracking from 'tracking';
import _ from 'lodash';
const config = {
	host: 'localhost',//local ip, remember to change on testing
	port: '3000',
	protocol: 'echo-protocol'
}
import SocketIOClient from 'socket.io-client';
// Creating the socket-client instance will automatically connect to the server.
const socketio = SocketIOClient('http://'+ config.host + ':' + config.port + '/');

class Cam extends Component {
  constructor(props){
    super(props);

    let video = null;
    let camera = null;
    let contxt = null;
		let dt = [];
		let imgsource = "";

    this.state = {
        data: [],
				imgsrc: "",
				sendImage: ""
    }
  }

	onUpdateImg(val){
		let source = val.replace("blob:", "");
	    this.setState(prevState =>{
	      prevState.imgsrc = source;
	      return prevState;
	    });
			this.setNewImgSource(source);
			//Only trigger the this.camtrack(dt) function IF there is an img loaded
			this.camtrack(this.dt);
	}

	setNewDataObj(dt){
	    this.dt = dt;
	}

	setNewImgSource(imgs){
		this.imgsource = imgs;
	}

  componentDidMount(){
    socketio.on('connect', () => {
      console.log("socketio.id: " + socketio.id); // Generate ID of client
      //Change the id of client and send it to the server
      // clientdt.id = socketio.id;
      socketio.on('getcolors', (dt) =>{
        // Get object and have it ready ONLY when an image is loaded
				this.setNewDataObj(dt);
      });
    });
    socketio.on('disconnect', () =>{
      console.log('user disconnected');
    });
  }

  camtrack(client){
      console.log("client");
      console.log(client);
      let allColors = [];
      let newColorNames = [];
       //Change colors each time we get a new set of colors
      // _.forEach(client, (value, key)=>{
        // console.log(value.id + " " + value.color);
        // let newColor = this.convertToRGB(value.color);
        // newColorNames.push(value.id);
        // console.log("value.id");
        // console.log(value.id);
        // let r = newColor[0];
        // let g = newColor[1];
        // let b = newColor[2];
      // });


        let colors = new tracking.ColorTracker(['magenta', 'cyan']);
        let modClient = client;
        let myevt = [];
        console.log(modClient);
        let dummy = {
          cyanx: 0,
          cyany: 0,
          cyanw: 0,
          cyanh: 0,
          magx: 0,
          magy:0,
          magw: 0,
          magh: 0
        };

        colors.on('track', (event)=> {
          this.contxt = this.refs.camera.getContext('2d');
          this.canvas = this.refs.camera;
          this.contxt.clearRect(0, 0, this.canvas.width, this.canvas.height);

          console.log("event.data");
          console.log(event.data);
          myevt = event.data;

          event.data.forEach((rect) =>{
            if (rect.color === 'custom') {
              rect.color = colors.customColor;
            }

            this.contxt.strokeStyle = rect.color;
            this.contxt.strokeRect(rect.x, rect.y, rect.width, rect.height);
            this.contxt.font = '11px Helvetica';
            this.contxt.fillStyle = "#f00";
            this.contxt.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            this.contxt.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
            console.log('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          });
        });


        let trackerTask = tracking.track('#video', colors, { camera: true });
				window.setTimeout(() =>{
					trackerTask.stop();
				}, 4500);

        window.setTimeout(() =>{
          for(let opx = 0; opx < myevt.length; opx++){
            modClient[opx].posx = myevt[opx].x;
            modClient[opx].posy = myevt[opx].y;
            modClient[opx].devw = myevt[opx].width;
            modClient[opx].devh = myevt[opx].height;
            modClient[opx].img = this.state.imgsrc;

            console.log("modClient[opx].posx");
            console.log(modClient[opx].posx);
          }
          socketio.emit("dummy", modClient);
        }, 5000);
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

  render() {
    let camstyle = {
      videocam: {
        marginLeft: '0px',
        marginTop: '15px',
        position: 'absolute',
				// backgroundColor: "rgba(0,0,0,0.1)",
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat',
        // backgroundImage: "url(http://mediang.gameswelt.net/public/images/201606/7962b7e8b6aaf20d6c5900418335fcbb.jpg)"
      }
    }

    return (
      <div>
				<div className="App-header">
					<h3> Hello there! This is the camera driver/manager for the Phone As Pixel Web App. Enjoy! </h3>
				</div>

				<div  className="camera-wrapper">
						<h1>Camera driver</h1>
						<div className="upload-zone">
										<h2> Choose an image to distribute on the devices </h2>
										<div className="choose-file">
												<Uploader onUpdate={(...args) => this.onUpdateImg(...args)}/>
												<img className="display-image" src={this.state.imgsrc} />
										</div>
						</div>

						<div className="camdrivers">
								<video id="video" style={camstyle.videocam} ref="video" width="680" height="350" preload autoPlay loop muted controls></video>
								<canvas id="canvas" style={camstyle.videocam}  ref="camera" width="680" height="350"></canvas>
						</div>
				</div>
      </div>
    );
  }
}

export default Cam;
