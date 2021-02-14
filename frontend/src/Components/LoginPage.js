import React, {Component} from "react";
import {Form , Input , Button} from "reactstrap";

export default class LoginPage extends Component{
    render(){
        return(
            <div className="page-with-form">
                <Form>
                    <Input type="text" placeholder="username"/>
                    <Input type="password" placeholder="password"/>
                    <Button color="primary" onClick={()=>{window.alert("logged-in");}}>log-in</Button>
                </Form>
            </div>
        );
    }
}