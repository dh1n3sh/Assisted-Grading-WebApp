import React , {Component} from "react";
import { ReactSession } from "react-client-session";
import { withRouter } from "react-router-dom";
import MyJumbotron from "./MyJumbotron";
import DashboardSectionComponent from "./DashboardSectionComponent";
import axios from "axios";

class DashboardPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            profName : ReactSession.get('userdata')['name'],
            courseName : undefined,
            courseId : undefined,
            testName : undefined,
            testId : undefined,
            courseSelected : false,
            data : []
        }
          
        this.dummyhandler = this.dummyhandler.bind(this);
        this.populateData = this.populateData.bind(this);
    }

    dummyhandler(e){
        console.log(e)
    }

    populateData(){

        if(this.state.courseId === undefined){
            axios.get('/api/courses')
                .then(res => {
                    console.log(res.data);
                })
        }
        else if (this.state.testId === undefined){
            axios.get('/api/tests')
                .then(res => {
                    console.log(res.data);
                })
        }
        else{
            axios.get('/api/submissions')
                .then(res => {
                    console.log(res.data);
                })
            // submission fetch
        }
    }

    componentDidMount(){

        this.populateData();
    }
    

    render(){

        return( 
            <div>
                <MyJumbotron state = {this.state} history = {this.props.history}/>
                <div className = "dashboard">
                    {this.state.data.map((obj)=><DashboardSectionComponent data = {obj} clickHandler = {this.dummyhandler} />)}
                </div>
            </div>
        );
    }
}

export default withRouter(DashboardPage);