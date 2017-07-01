import React, {  Component } from 'react';
import { AppRegistry, Image, StyleSheet, Text, View } from 'react-native';
import Mainstyles from './app/styles/Mainstyles.js';
import config from './app/lib/config.js';
import socketio from './app/lib/ws_client.js';
import socketcli from 'socket.io-client';

export default class PhoneAsPixel extends Component {

  constructor(props) {
    super(props);

    this.state = {
        data: {}
    }
  }

  componentDidMount() {
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
    console.log('this.state');
    console.log(this.state.data.color);

    let conio = this.state.data.color;

    let imgStyles = StyleSheet.create({
      sharedImg:{
        resizeMode: 'cover',
        width: 1920,
        height: 765,
        top: -45,
        left: -45,
      },
      starterImg: {
        width: 1920,
        height: 765,
        backgroundColor: this.state.data.color,
      }
    });

    return (
      <View style={imgStyles.starterImg}>
      </View>
    );
  }
}

AppRegistry.registerComponent('PhoneAsPixel', () => PhoneAsPixel);
