import React, { Component } from "react";

export default class DashboardSectionComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            clickHandler: props.clickHandler
        }

    }

    static getDerivedStateFromProps(props, state) {
        // if(props === state)

        let newState = {
            data: props.data,
            clickHandler: props.clickHandler
        }
        return newState
    }

    render() {
        return <div className="dashboard-section"
            onClick={(e) => { this.state.clickHandler(this.state.data) }}>{this.state.data.name}</div>
    }
}