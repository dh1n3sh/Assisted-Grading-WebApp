import React , {Component} from "react";
import { BrowserRouter as Router , Route , Switch } from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import GradingPage from "./Components/GradingPage";
import LoginPage from "./Components/LoginPage";

class App extends Component {
  
  render(){

    return (
    <Router>
      <Switch>
        <Route exact path="/grading" component={GradingPage}/>
        <Route exact path="/" component={LoginPage}/>
      </Switch>
    </Router>
    );
  }
}

export default App;
