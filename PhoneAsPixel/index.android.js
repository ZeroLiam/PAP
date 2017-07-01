import React, {  Component } from 'react';
import { AppRegistry, Image, StyleSheet, Text, View } from 'react-native';
import Mainstyles from './app/styles/Mainstyles.js';
import config from './app/lib/config.js';
import socketio from './app/lib/ws_client.js';
import socketcli from 'socket.io-client';

export default class PhoneAsPixel extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount(){
    console.log("componentDidMount");
    let dt = {};
    socketio.on('connect', () => {
      console.log("socketio.id: " + socketio.id); // 'G5p5...'
      dt.id = socketio.id;
      socketio.emit('joinimg', dt);
    });
    socketio.on('disconnect', function(){
      console.log('user disconnected');
    });
  }

  render() {
    return (
      <View style={Mainstyles.container}>
        <Text style={Mainstyles.welcome}>
          Welcome to React Native Homie!
        </Text>
        <Text style={Mainstyles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={Mainstyles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>

    );
  }
}

AppRegistry.registerComponent('PhoneAsPixel', () => PhoneAsPixel);
