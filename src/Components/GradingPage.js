import React , {Component} from "react"
import SectionComponent from "./SectionComponent";
import axios from './axiosConfig'
// import test from "../Data/getSubmissionTest.json"
// import image from "../Data/2_2.jpg";
import MyJumbotron from "./MyJumbotron";
import { withRouter } from "react-router-dom";

class GradingPage extends Component{

    constructor(props){

        super(props);
    
        this.state = {
            segments : ["original" , "paragraphs" , "tables" , "images"],
            test : undefined,
            isSubQuestionVisible : false,
            currQno : undefined,
            subQuestionMarks : undefined,
            dashboardstate : this.props.location.state,
            imageUrl : undefined,
            data : this.props.location.data,
        }
        this.handleMarkState = this.handleMarkState.bind(this);
        this.goBack = this.goBack.bind(this);
        // this.getMarks = this.getMarks.bind(this);
      }

      // getMarks(tree,path){
      //   if(path.length === 0) return tree;
      //   let newPath = path.map(x=>x);
      //   newPath.shift();
      //   return this.getMarks(tree[path[0]],newPath);
      // }
    
      handleMarkState(isSubQuestionVisible,currQno,data){
        // console.log(data);

        let path = currQno.split("-")
        path.shift();
        // let marks = this.getMarks(this.state.qptree,path);
        let marks = data[2];
        let imageUrl = data[3];
        // console.log(imageUrl)
        this.setState({
          isSubQuestionVisible : isSubQuestionVisible,
          currQno : currQno,
          subQuestionMarks : marks,
          imageUrl : imageUrl
        });
      }
    
      componentDidMount(){
        // TODO
        // console.log(this.state.data)
        axios.get(this.state.data.grade_tree)
          .then(res=>{
            // console.log(res)
            if(res.status < 300 && res.status > 199){
              this.setState({
                test : {'QpPattern' : res.data}
              })
            }
          })
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
        console.log(this.state.data)
        return (
          <div>
            <MyJumbotron state={this.state.dashboardstate} history={this.props.history} dontRenderButton={true} goBack={this.goBack}/>
            <div className="App">
                <SectionComponent width="15%" heading="questions" data={this.state.test} handleMarkState ={this.handleMarkState} />
                <SectionComponent width="15%" heading="segments" data={this.state.segments} />
                <SectionComponent width="50%" heading="answer scripts" data={this.state.imageUrl}/>
                {/* imaged need above  */}
                <SectionComponent width="20%" heading="marks allocation" data="dummy"
                                  isSubQuestionVisible={this.state.isSubQuestionVisible}
                                  currQno={this.state.currQno}
                                  subQuestionMarks={this.state.subQuestionMarks}
                                  handwritingVerified={this.state.data["handwriting_verified"]}
                                  />
            </div>
          </div>
        );
      
      }

}

export default withRouter(GradingPage);