import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-sortable-tree/style.css';

import GradingPage from "./Components/GradingPage";
import LoginPage from "./Components/LoginPage";
import LoginPage2 from "./Components/LoginPage2";
import TestCreationPage from "./Components/TestCreationPage";
import DashboardPage from "./Components/DashboardPage";

class App extends Component {

  render() {

    return (
      <Router>
        <Switch>
          <Route exact path="/grading" component={GradingPage} />
          <Route exact path="/test-creation" component={TestCreationPage} />
          <Route exact path="/home" component={DashboardPage} />
          <Route exact path="/login2" component={LoginPage2} />
          <Route exact path="/" component={LoginPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
