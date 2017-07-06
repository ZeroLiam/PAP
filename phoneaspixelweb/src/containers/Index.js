import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';
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
      dtobj.display = 'none';
      this.setState({data: dtobj});
      //emit to server this color and id
      socketio.emit('devices', dtobj);

    });
    socketio.on('setPosition', (posObj) => {
      console.log(posObj);
      for( let idx = 0; idx < posObj.length; idx++){
        if(posObj[idx].id == this.state.data.id){
          // // console.log(posObj[idx]);
          // console.log("this.state.data");
          // console.log(this.state.data);
          let newDataState = update(this.state.data, {
            posx: {$set: posObj[idx].posx}, posy: {$set: posObj[idx].posy}, display: {$set: 'block'}
          });
          //
          // console.log("newDataState");
          // console.log(newDataState);

          this.setState({data: newDataState});
          // console.log("this.state.data");
          // console.log(this.state.data);
        }
      }

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

    let imgdiv = {
      display: this.state.data.display,
      top: this.state.data.posy,
      left: this.state.data.posx,
      src: "url(" + this.state.data.img + ")",
      backgroundRepeat: 'noRepeat'
    }

    return (
      <div style={{backgroundColor: maindiv.bgcolor, width: maindiv.width, height: maindiv.height}}>
        <div style={{width: maindiv.width, height: maindiv.height, display:imgdiv.display, backgroundImage: imgdiv.src, backgroundRepeat:'no-repeat', backgroundSize: '3064px 3640px'}}> </div>
      </div>
    );
  }
}

export default Index;
