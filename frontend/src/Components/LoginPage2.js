import React, { Component } from "react";
import { Form, Input, Button } from "reactstrap";
import axios from "axios";

export default class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            pwd: ""
        }

        this.login = this.login.bind(this);
        this.changeHandler = this.changeHandler.bind(this);

    }

    login(event) {

        event.preventDefault();

        let { username, pwd } = this.state;

        console.log(username);
        console.log(pwd);

        axios.post("http://localhost:8000/api-auth/login/", {
            username: username,
            password: pwd
        })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => { console.log(err) });

    }

    changeHandler(event) {

        let { name, value } = event.target;

        this.setState({ [name]: value });
    }

    render() {
        return (
            <div className="page-with-form">
                <Form onSubmit={this.login}>
                    <Input type="text" name="username" placeholder="username" value={this.state.username} onChange={this.changeHandler} />
                    <Input type="password" name="pwd" placeholder="password" value={this.state.pwd} onChange={this.changeHandler} />
                    <Button color="primary">log-in</Button>
                </Form>
            </div>
        );
    }
}