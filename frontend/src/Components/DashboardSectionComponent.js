import React, { Component } from "react";

export default class DashboardSectionComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            type : props.type,
            clickHandler: props.clickHandler
        }

    }

    static getDerivedStateFromProps(props, state) {
        // if(props === state)

        let newState = {
            data: props.data,
            type : props.type,
            clickHandler: props.clickHandler
        }
        return newState
    }

    render() {
        return <div className="dashboard-section"
            onClick={(e) => { this.state.clickHandler(this.state.data) }}>{this.state.data.name}<img src="../../public/delete-24px.svg"/></div>
    }
}