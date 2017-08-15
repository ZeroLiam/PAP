import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';
import './../App.css';
import socketio from './../lib/ws_client';

class Index extends Component {
  constructor(props){
    super(props);

    let canvas;

    let scaleChanged = false;
    let theScalex = 1;
    let theScaley = 1;

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
      // dtobj.img = data.img;
      dtobj.img = '';
      dtobj.color = data.color;
      dtobj.connected = true;
      dtobj.posx = 0;
      dtobj.posy = 0;
      dtobj.devw = 0;
      dtobj.devh = 0;
      dtobj.display = 'none';
      this.setState({data: dtobj});

      //emit to server this color and id
      socketio.emit('devices', dtobj);
    });

    socketio.on('setPosition', (posObj) => {
          console.log(posObj);
          this.dsp = 'visible';
          this.scaleChanged = true;
          for( let idx = 0; idx < posObj.length; idx++){
            if(posObj[idx].id == this.state.data.id){

              let newDataState = update(this.state.data, {
                img: {$set: posObj[idx].img}, posx: {$set: posObj[idx].posx}, posy: {$set: posObj[idx].posy}, display: {$set: posObj[idx].display}, devw: {$set: posObj[idx].devw}, devh: {$set: posObj[idx].devh}
              });
              this.setState({data: newDataState});

            }
          }

          console.log(this.state.data.img);
      });

    socketio.on('disconnect', () =>{
      let displayStat = update(this.state.data, {
        display: {$set: 'none'}
      });
      this.setState({data: displayStat});

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
    let newSizeWidth = ((this.state.data.devw * 100) / maindiv.width) / 100;
    let newSizeHeight = ((this.state.data.devh * 100) / maindiv.height) / 100;
    //http://s1.picswalls.com/wallpapers/2014/07/19/colorful-wallpaper_110901754_65.jpg

    if(this.scaleChanged){
      this.theScaley = newSizeHeight;
      this.theScalex = newSizeWidth;
    }
    let newPosx = (this.state.data.posx * 680) * this.theScalex;
    let newPosy = (this.state.data.posy * this.theScaley * 10) + 350;

    let imgdiv = {
      position: 'relative',
      backgroundSize: "cover",
      width: maindiv.width + "px",
      height: maindiv.height + "px",
      display: this.state.data.display,
      backgroundImage:"url("+ this.state.data.img + ")",
      backgroundRepeat:'no-repeat',
      transform: "scaleX(5) scaleY(5)",
      transformOrigin: "(-"+ newPosx +"px -"+ newPosy+"px)"
    }


    return (
      <div>
      <div style={{backgroundColor: maindiv.bgcolor, width: maindiv.width, height: maindiv.height}}>
        <div style={imgdiv}></div>
      </div>



      </div>
    );
  }
}

export default Index;
