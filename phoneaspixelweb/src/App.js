import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import './App.css';
import Index from './containers/Index';
import _ from 'lodash';

class App extends Component {

  render() {

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Index} >
        </Route>
      </Router>
    );
  }
}

export default App;
