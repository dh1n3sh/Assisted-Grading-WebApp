import React , {Component} from "react";
import { Jumbotron } from "reactstrap";

import DashboardSectionComponent from "./DashboardSectionComponent";

export default class DashboardPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            profName : "Aravindan",
            courseName : "TOC",
            courseId : "CS7092",
            data : [ "some" , "made" , "up" , "shit" , "to" , "mock" , "data" , "stream", "of", "either", "courses", "or", "tests" ]
        }

        this.dummyhandler = this.dummyhandler.bind(this);
        
    }

    dummyhandler(e){
        console.log(e)
    }
    

    render(){
        return( 
            <div>
                <Jumbotron fluid>
                    <div style =  {{width : "100vw" , display : "flex" , flexDirection : "row" , justifyContent : "space-around"}}>
                        <div >{this.state.courseId + " - " + this.state.courseName}</div>
                        <div >{this.state.profName}</div>
                    </div>
                </Jumbotron>
                <div className = "dashboard">
                    {this.state.data.map((obj)=><DashboardSectionComponent data = {obj} clickHandler = {this.dummyhandler} />)}
                </div>
            </div>
        );
    }
}