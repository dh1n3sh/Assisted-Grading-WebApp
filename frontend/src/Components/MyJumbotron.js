import React, { Component } from "react"
import { ReactSession } from "react-client-session";
import { Button, Jumbotron } from "reactstrap";

class MyJumbotron extends Component {


    // console.log(props);
    render() {

        // console.log(this.props.state.selectedFields);
        return <Jumbotron fluid>

            <div style={{ width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div> <Button color='primary' onClick={this.props.goBack}> Back </Button></div>
                <div>{ReactSession.get('userdata')['name']}</div>
                {this.props.state.selectedFields.map((indvField)=>{return <div>{indvField.name}</div>})}
                <div > {this.props.dontRenderButton!=true && <Button color="primary" onClick={this.props.addBtnHandler}>Add</Button>}</div>
                <div > <Button color="danger"
                    onClick={() => { ReactSession.remove('userdata'); this.props.history.push('/login') }}>Logout</Button></div>
            </div>
        </Jumbotron>
    }
}

export default MyJumbotron;