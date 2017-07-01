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
      id: '',
      img: '',
      posX: 0,
      posY: 0
    }
  }

  componentDidMount(){
    console.log("componentDidMount");
    socketio.on('connect', () => {
      console.log("socketio.id: " + socketio.id); // Generate ID of client
      //Change the id of client and send it to the server
      this.setState({id: socketio.id}, () => {socketio.emit('joinimg', this.state);});

    });
    socketio.on('message', (data) =>{
      //Get Image from server
      this.setState({img: data.img}, () => {console.log(this.state.img)});
      console.log('user received: ' + data.img);
    });
    socketio.on('disconnect', () =>{
      console.log('user disconnected');
    });

  }

  render() {

    let imgStyles = StyleSheet.create({
      sharedImg:{
        resizeMode: 'cover',
        width: 1920,
        height: 765,
        top: -45,
        left: -45,
      }
    });

    return (
      <View style={Mainstyles.container}>
        <Image source={{uri: this.state.img}}
              style={imgStyles.sharedImg} />
      </View>

    );
  }
}

AppRegistry.registerComponent('PhoneAsPixel', () => PhoneAsPixel);
