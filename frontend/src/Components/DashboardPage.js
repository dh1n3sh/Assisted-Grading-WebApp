import React , {Component} from "react";
import { Jumbotron } from "reactstrap";

export default class DashboardPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            profName : "Aravindan",
            courseName : "TOC",
            courseId : "CS7092"
        }
    }

    render(){
        return( 
            <div>
                <Jumbotron fluid>
                    <div style = {{width : "100vw" , display : "flex" , flexDirection : "row" , justifyContent : "space-around"}}>
                        <div >{this.state.courseId + " - " + this.state.courseName}</div>
                        <div >{this.state.profName}</div>
                    </div>
                </Jumbotron>

            </div>
        );
    }
}