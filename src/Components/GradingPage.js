import React , {Component} from "react"
import SectionComponent from "./SectionComponent";
import axios from './axiosConfig'
// import test from "../Data/getSubmissionTest.json"
// import image from "../Data/2_2.jpg";
import MyJumbotron from "./MyJumbotron";
import { withRouter } from "react-router-dom";
import FormData from "form-data"
import {Button} from "reactstrap"

class GradingPage extends Component{

    constructor(props){

        super(props);
    
        this.state = {
            segments : ["original" , "paragraphs" , "tables" , "images"],
            test : undefined,
            isSubQuestionVisible : false,
            currQno : undefined,
            subQuestionMarks : undefined,
            marksGiven : undefined,
            dashboardstate : this.props.location.state,
            imageUrl : undefined,
            data : this.props.location.data,
        }
        this.handleMarkState = this.handleMarkState.bind(this);
        this.goBack = this.goBack.bind(this);
        this.enterMarks = this.enterMarks.bind(this);
        this.changeObject = this.changeObject.bind(this);
        this.enterRemarks = this.enterRemarks.bind(this);
        this.finishEval = this.finishEval.bind(this);
        // this.getMarks = this.getMarks.bind(this);
        this.setDefault = this.setDefault.bind(this);
        this.getFirstChild = this.getFirstChild.bind(this);
      }

      // getMarks(tree,path){
      //   if(path.length === 0) return tree;
      //   let newPath = path.map(x=>x);
      //   newPath.shift();
      //   return this.getMarks(tree[path[0]],newPath);
      // }
    
      setDefault(){
        const firstChild = this.getFirstChild('Q',this.state.test.QpPattern);
        const imgUrls = firstChild.node[3].map( url => { return { original : url , thumbnail : url }});
        this.setState({
          isSubQuestionVisible : true,
          currQno : firstChild.currQno,
          subQuestionMarks : firstChild.node[2],
          marksGiven : firstChild.node[1],
          imageUrl : imgUrls
        });
      }

      getFirstChild(currQno,tree){

        if(Array.isArray(tree)) return { currQno : currQno , node : tree };

        const keyList = Object.keys(tree).sort();

        return this.getFirstChild(currQno + '-' + keyList[0] , tree[keyList[0]]);
      }


      handleMarkState(isSubQuestionVisible,currQno,data){
        // console.log(data);
        let path = currQno.split("-")
        path.shift();
        // let marks = this.getMarks(this.state.qptree,path);
        // console.log(data)
        let marks = data[2];
        let marksGiven = data[1];
        let imageUrl;
        if(data[3] && data[3].length)  {
          imageUrl=  data[3].map(x => { return {original: x,thumbnail:x }})
          // imageUrl = data[3];

        }
        // else 
        //   imageUrl = "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"

        // console.log(imageUrl)
         const images = [
           {
             original: 'https://picsum.photos/id/1018/1000/600/',
             thumbnail: 'https://picsum.photos/id/1018/1000/600/',
           }
         ];

        this.setState({
          isSubQuestionVisible : isSubQuestionVisible,
          currQno : currQno,
          subQuestionMarks : marks,
          marksGiven : marksGiven,
          imageUrl : imageUrl
        });
      }
    
      componentDidMount(){
        // TODO
        // console.log(this.state.data)
        axios.get(this.state.data.grade_tree)
          .then(res=>{
            console.log('res')
            console.log(res.data)
            console.log(typeof(res.data))
            // console.log(res.data['5'][3])
            if(res.status < 300 && res.status > 199){
              this.setState({
                test : {'QpPattern' : res.data}
              },()=>{this.setDefault();})
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

      
      changeObject(obj,keylist,newvalue){
        if(keylist.length === 0){
          obj[1] = Number(newvalue)
          return obj
        }

        let curkey = keylist[0]

        keylist.shift()

        obj[curkey] = this.changeObject(obj[curkey],keylist,newvalue)

        return obj
      }

      // enterMarks(qStr,marks){

      //   if(qStr === undefined) return

      //   var newTest = JSON.parse(JSON.stringify(this.state.test));
      //   let qlist = qStr.split("-")
      //   qlist.shift()

      //   newTest.QpPattern = this.changeObject(newTest.QpPattern,qlist,marks)

      //   this.setState({
      //     test : newTest
      //   },()=>{window.alert("marks updated!")})
      // }

      changeObjectForRemarks(obj,keylist,newvalue){
        if(keylist.length === 0){
          obj[0] = newvalue
          return obj
        }

        let curkey = keylist[0]

        keylist.shift()

        obj[curkey] = this.changeObjectForRemarks(obj[curkey],keylist,newvalue)

        return obj
      }


      
      enterMarks(event){

        let qStr = event.target.name
        let marks = event.target.value

        if(qStr === undefined) return

        var newTest = JSON.parse(JSON.stringify(this.state.test));
        let qlist = qStr.split("-")
        qlist.shift()

        newTest.QpPattern = this.changeObject(newTest.QpPattern,qlist,marks)

        this.setState({
          test : newTest
        })
      }

      enterRemarks(event){

        let qStr = event.target.name
        let remarks = event.target.value

        if(qStr === undefined) return

        var newTest = JSON.parse(JSON.stringify(this.state.test));
        let qlist = qStr.split("-")
        qlist.shift()

        newTest.QpPattern = this.changeObjectForRemarks(newTest.QpPattern,qlist,remarks)

        this.setState({
          test : newTest
        })
      }

      finishEval(){
        let putdata = JSON.parse(JSON.stringify(this.state.dashboardstate.selectedFields[2]));
        let grade_tree = JSON.parse(JSON.stringify(this.state.test.QpPattern))
        putdata.grade_tree = grade_tree

        let formData = new FormData();
        // formData.append("hey","hello")
        formData.append('id',putdata.id)
        var gtree = JSON.stringify(grade_tree);
        var gtBlob = new Blob([gtree], { type  : "application/json"});
        formData.append('grade_tree' , gtBlob, 'grade_tree.json');
        // console.log(Array.from(formData.keys()))
        axios.put('/api/gradetree/'+putdata.id+'/',formData)
          .then((res)=>{
            console.log(res)
            window.alert("submission evalation updated !")
          })
      }
    
      render(){
        // "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
        // console.log(this.state.data)
        // console.log(this.state.imageUrl)
        // console.log(this.state)
        let nav_history = "";
        this.state.dashboardstate.selectedFields.forEach(element => {
            if (nav_history === "") nav_history += element.name
            else nav_history += (" > " + element.name)
        });
        const capitalize = (s) => {
          if (typeof s !== 'string') return ''
          return s.charAt(0).toUpperCase() + s.slice(1)
        }
        return (
          <div>
            <MyJumbotron state={this.state.dashboardstate} history={this.props.history} dontRenderButton={true} goBack={this.goBack}/>
            {/* Start of screen info card */}
            <div className = "info-card">
                <div className = "info-card-title">
                    { capitalize("Grading page") }
                </div>
                <div className = "info-card-nav">
                    <div style={ { margin : '2vh' , lineHeight : '5vh' , height : '5vh'} }>
                        {nav_history}
                    </div>
                </div>
            </div>
            {/* End of screen info card */}
            <div className="App">
                <SectionComponent width="20%" heading="questions" data={this.state.test} handleMarkState ={this.handleMarkState} />
                {/* <SectionComponent width="15%" heading="segments" data={this.state.segments} />*/}
                <SectionComponent width="60%" heading="answer scripts" data={this.state.imageUrl}/>
                {/* imaged need above  */}
                <SectionComponent width="20%" heading="marks allocation" data="dummy"
                                  isSubQuestionVisible={this.state.isSubQuestionVisible}
                                  currQno={this.state.currQno}
                                  subQuestionMarks={this.state.subQuestionMarks}
                                  handwritingVerified={this.state.data["handwriting_verified"]}
                                  enterMarks = {this.enterMarks}
                                  marksGiven = {this.state.marksGiven}
                                  test = {this.state.test}
                                  enterRemarks = {this.enterRemarks}
                                  finishEval = {this.finishEval}
                                  />
            </div>
          </div>
        );
      
      }

}

export default withRouter(GradingPage);