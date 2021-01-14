import React , {Component} from "react"
import './App.css';
import axios from "axios";

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      data : []
    }

    axios.get("/api/login/")
    .then(users => { 
      console.log(users.data);
      this.setState({data : users.data})
    })
    .catch(err => console.log(err))

  }
  render(){
    
    return (
      <div className="App">
          <ul>
             {this.state.data.length===0?"hey":this.state.data.map(user => <li>{user.username}</li>)}
          </ul>       
      </div>
    );
  
  }
}

export default App;
