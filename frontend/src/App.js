import React , {Component} from "react"
import './App.css';
import SectionComponent from "./Components/SectionComponent";
import 'bootstrap/dist/css/bootstrap.css';
import test from "./Data/getSubmissionTest.json"

class App extends Component {
  
  constructor(props){

    super(props);

    this.state = {
        segments : ["original" , "paragraphs" , "tables" , "images"],
        test : test
    }

    console.log(this.state)

  }

  componentDidMount(){
    document.title = "grading"
  }

  render(){
    
    return (
      <div className="App">
          <SectionComponent width="15%" heading="questions" data={this.state.test}/>
          <SectionComponent width="15%" heading="segments" data={this.state.segments} />
          <SectionComponent width="50%" heading="answer scripts"/>
          <SectionComponent width="20%" heading="marks allocation"/>
      </div>
    );
  
  }
}

export default App;
