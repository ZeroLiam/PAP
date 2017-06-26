import React, {  Component } from 'react';
import { AppRegistry, Image, StyleSheet, Text, View } from 'react-native';
import Mainstyles from './app/styles/Mainstyles.js';
import config from './app/lib/config.js';
import ws from './app/lib/ws.js';

export default class PhoneAsPixel extends Component {
  constructor(props){
    super(props);

    this.state = {
      connected: false
    }
  }

  componentWillMount(){
    // console.log("ws: " + ws.onmessage());
    // ws.onopen();
    // const ws = new WebSocket(config.staging.host + ":" + config.staging.port);
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
