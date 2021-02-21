import React, { Component } from "react";
import { ReactSession } from "react-client-session";
import { withRouter } from "react-router-dom";
import MyJumbotron from "./MyJumbotron";
import DashboardSectionComponent from "./DashboardSectionComponent";
import axios from "axios";

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            profName: ReactSession.get('userdata')['name'],
            courseName: undefined,
            courseId: undefined,
            testName: undefined,
            testId: undefined,
            courseSelected: false,
            curType: 0,
            availableTypes: ['course', 'test', 'submission'],
            selectedFields: [],
            data: ['']
        }

        this.clickhandler = this.clickhandler.bind(this);
        this.populateData = this.populateData.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    clickhandler(data) {
        this.setState((prevState) => {
            let newSelectedfields = prevState.selectedFields
            newSelectedfields.push(data.id)
            return {
                curType: prevState.curType + 1,
                selectedFields: newSelectedfields
            }
        }, this.populateData)

        console.log(data)

    }

    populateData() {
        axios.get('/api/' + this.state.availableTypes[this.state.curType] + 's', {
            params: {
                [this.state.availableTypes[this.state.curType - 1]]: this.state.selectedFields[this.state.selectedFields.length - 1]
            }
        })
            .then(res => {
                this.setState({ data: res.data }, () => { console.log(this.state.data) })
                console.log(res.data);
            })

        // if (DataType === 'courses') {

        // }
        // else if (DataType === 'tests') {

        // }
        // else if (DataType === 'submissions') {

        // }
    }

    // populateData(data) {
    //     if (data !== undefined) {

    //         // this.setState({});           
    //     }
    //     if (this.state.courseId === undefined) {
    //         axios.get('/api/courses')
    //             .then(res => {
    //                 this.setState({ data: res.data })
    //                 console.log(res.data);
    //             })
    //     }
    //     else if (this.state.testId === undefined) {
    //         axios.get('/api/tests')
    //             .then(res => {
    //                 console.log(res.data);
    //             })
    //     }
    //     else {
    //         axios.get('/api/submissions')
    //             .then(res => {
    //                 console.log(res.data);
    //             })
    //         // submission fetch
    //     }
    // }

    componentDidMount() {
        this.populateData();
    }

    goBack() {

        this.setState((prevState) => {
            let newSelectedfields = prevState.selectedFields
            newSelectedfields.pop()
            return {
                curType: prevState.curType - 1,
                selectedFields: newSelectedfields
            }
        }, this.populateData)
    }

    render() {

        return (
            <div>
                <MyJumbotron state={this.state} history={this.props.history} goBack={this.goBack} />
                <div className="dashboard">
                    {this.state.data.map((obj) => <DashboardSectionComponent data={obj} clickHandler={this.clickhandler} />)}
                </div>
            </div>
        );
    }
}

export default withRouter(DashboardPage);