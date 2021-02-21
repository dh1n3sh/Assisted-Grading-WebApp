import React, { Component } from "react"
import { ReactSession } from "react-client-session";
import { Button, Jumbotron } from "reactstrap";

class MyJumbotron extends Component {


    // console.log(props);
    render() {
        return <Jumbotron fluid>

            <div style={{ width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div> <Button color='primary' onClick={this.props.goBack}> Back </Button></div>
                <div >{this.props.state.courseId + " - " + this.props.state.courseName}</div>
                <div >{this.props.state.profName}</div>
                <div > {this.props.state.courseSelected && <Button color="primary">Add test</Button>}</div>
                <div > <Button color="danger"
                    onClick={() => { ReactSession.remove('userdata'); this.props.history.push('/login') }}>Logout</Button></div>
            </div>
        </Jumbotron>
    }
}

export default MyJumbotron;