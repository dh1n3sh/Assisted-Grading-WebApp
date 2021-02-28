import React , {Component} from "react"
import SectionComponent from "./SectionComponent";
import test from "../Data/getSubmissionTest.json"
import image from "../Data/2_2.jpg";
import MyJumbotron from "./MyJumbotron";
import { withRouter } from "react-router-dom";

class GradingPage extends Component{

    constructor(props){

        super(props);
    
        this.state = {
            segments : ["original" , "paragraphs" , "tables" , "images"],
            test : test,
            isSubQuestionVisible : false,
            currQno : undefined,
            subQuestionMarks : undefined,
            dashboardstate : this.props.location.state
        }
        this.handleMarkState = this.handleMarkState.bind(this);
        this.goBack = this.goBack.bind(this);
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

      goBack(){
        let newDashboardstate = { ...this.state.dashboardstate};
        newDashboardstate.curType --;
        newDashboardstate.selectedFields.pop();

        this.setState({ dashboardstate : newDashboardstate},()=>{
          this.props.history.push({
          pathname : '/',
          state : this.state.dashboardstate
          });
        })
      }
    
      render(){
        // "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
        // console.log(this.state.goBack)
        return (
          <div>
            <MyJumbotron state={this.state.dashboardstate} history={this.props.history} dontRenderButton={true} goBack={this.goBack}/>
            <div className="App">
                <SectionComponent width="15%" heading="questions" data={this.state.test} handleMarkState ={this.handleMarkState} />
                <SectionComponent width="15%" heading="segments" data={this.state.segments} />
                <SectionComponent width="50%" heading="answer scripts" data={image}/>
                <SectionComponent width="20%" heading="marks allocation" data="dummy"
                                  isSubQuestionVisible={this.state.isSubQuestionVisible}
                                  currQno={this.state.currQno}
                                  subQuestionMarks={this.state.subQuestionMarks}
                                  />
            </div>
          </div>
        );
      
      }

}

export default withRouter(GradingPage);