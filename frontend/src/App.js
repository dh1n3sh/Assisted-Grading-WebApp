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
        test : test,
        isSubQuestionVisible : false,
        currQno : undefined,
        subQuestionMarks : undefined
    }
    this.handleMarkState = this.handleMarkState.bind(this);
  }

  handleMarkState(isSubQuestionVisible,currQno,subQuestionMarks){
    this.setState({
      isSubQuestionVisible : isSubQuestionVisible,
      currQno : currQno,
      subQuestionMarks : subQuestionMarks
    });
  }

  componentDidMount(){
    document.title = "grading"
  }

  render(){
    
    return (
      <div className="App">
          <SectionComponent width="15%" heading="questions" data={this.state.test} handleMarkState ={this.handleMarkState} />
          <SectionComponent width="15%" heading="segments" data={this.state.segments} />
          <SectionComponent width="50%" heading="answer scripts" data={"https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"}/>
          <SectionComponent width="20%" heading="marks allocation" data="dummy"
                            isSubQuestionVisible={this.state.isSubQuestionVisible}
                            currQno={this.state.currQno}
                            subQuestionMarks={this.state.subQuestionMarks}
                            />
      </div>
    );
  
  }
}

export default App;
