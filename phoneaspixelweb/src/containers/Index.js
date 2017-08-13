import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';
import './../App.css';
import socketio from './../lib/ws_client';

class Index extends Component {
  constructor(props){
    super(props);

    let canvas;

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
      dtobj.img = 'http://mediang.gameswelt.net/public/images/201606/7962b7e8b6aaf20d6c5900418335fcbb.jpg';
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
      for( let idx = 0; idx < posObj.length; idx++){
        if(posObj[idx].id == this.state.data.id){
          let newDataState = update(this.state.data, {
            posx: {$set: posObj[idx].posx}, posy: {$set: posObj[idx].posy}, display: {$set: 'block'}, devw: {$set: posObj[idx].devw}, devh: {$set: posObj[idx].devh}
          });

          this.setState({data: newDataState});
        }
      }

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

    let bgPos = (500 + (this.state.data.posy - this.state.data.devw) ) * -1 + 'px ' + (500 + (this.state.data.posx - this.state.data.devh)) * -1 + 'px';
    bgPos = bgPos.toString();

    console.log("my position is " + bgPos);

    let theimg = new Image();
    theimg.src = this.state.data.img;
    let canv = this.refs.canvas;
    // let cont = canv.getContext('2d');
    // cont.drawImage(this.state.data.img, this.state.data.posx, this.state.data.posy, this.state.data.devw, this.state.data.devh);


    let imgdiv = {
      position: 'absolute',
      display: this.state.data.display,
      backgroundPosition: bgPos,
      src: "url(" + this.state.data.img + ")",
      backgroundRepeat: 'noRepeat',
      left: (this.state.data.posx + this.state.data.devw) * -1,
      top: ((this.state.data.posy + this.state.data.devh) * -1),
      clip: 'rect(' + this.state.data.posy + 'px,' + (this.state.data.posx + this.state.data.devw)+ 'px,' + (this.state.data.posy + this.state.data.devh) + 'px,' + this.state.data.posx + ')'
    }


    return (
      <div style={{backgroundColor: maindiv.bgcolor, width: maindiv.width, height: maindiv.height}}>
          <div style={{display:imgdiv.display, backgroundPosition:imgdiv.backgroundPosition, backgroundImage: imgdiv.src, backgroundRepeat:'no-repeat', backgroundSize: 'cover', width:"1680px", height: "1400px"}}> </div>
      </div>
    );
  }
}

export default Index;
