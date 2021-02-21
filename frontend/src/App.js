import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route,Switch } from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-sortable-tree/style.css';

import GradingPage from "./Components/GradingPage";
import LoginPage from "./Components/LoginPage";
// import LoginPage2 from "./Components/LoginPage2";
import TestCreationPage from "./Components/TestCreationPage";
import DashboardPage from "./Components/DashboardPage";

import {ReactSession} from 'react-client-session';

class App extends Component {

  constructor(props){
    
    super(props);

  }

  render() {

    ReactSession.setStoreType("localStorage");

    return (
      <Router>
        <Switch>
          <PrivateRoute path="/grading" component={GradingPage} />
          <PrivateRoute path="/test-creation" component={TestCreationPage} />
          <LoginRoute path="/login" component={LoginPage} />
          {/* <Route exact path="/login2" component={LoginPage2} /> */}
          <PrivateRoute exact path="/" component={DashboardPage} />
        </Switch>
      </Router>
    );
  }
}

function LoginRoute(props){
      return isLoggedIn() ?
            <Redirect to='/'/> : 
            <Route exact path={props.path} component={props.component}/>
}

function PrivateRoute(props){
    return isLoggedIn() ? 
            <Route exact path={props.path} component={props.component}/> : 
            <Redirect to='/login'/>
}

function isLoggedIn()
{
    return ReactSession.get('userdata') !== undefined;
}

export default App;
