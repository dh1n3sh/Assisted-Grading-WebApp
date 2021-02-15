import React , {Component} from "react";

export default class DashboardSectionComponent extends Component{

    constructor(props){
        super(props);

        this.state = {
             data : props.data,
             clickHandler : props.clickHandler
        }

    }

    render(){
        return <div className = "dashboard-section" onClick = {(e)=>{this.state.clickHandler(this.state.data)}}>{this.state.data}</div>
    }
}