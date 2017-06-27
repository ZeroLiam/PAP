import React, {  Component } from 'react';
import { AppRegistry, Image, StyleSheet, Text, View } from 'react-native';
import Mainstyles from './app/styles/Mainstyles.js';
import config from './app/lib/config.js';
import websocket from './app/lib/ws_client.js';
import socketcli from 'socket.io-client';

export default class PhoneAsPixel extends Component {

  constructor(props) {
    super(props);

    // Creating the socket-client instance will automatically connect to the server.
    this.websocket = socketcli('http://'+ config.host + ':' + config.port);
  }

  componentDidMount(){
    console.log("componentDidMount");

    websocket.emit('channel-name', 'Hello world!');
    websocket.disconnect();
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
