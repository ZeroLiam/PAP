import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';

import './App.css';
import Index from './containers/Index';
import Index from './containers/Cam';
import _ from 'lodash';

class App extends Component {

  render() {

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Index} />
          <Route path="/cam" component={Cam} />
      </Router>
    );
  }
}

export default App;
