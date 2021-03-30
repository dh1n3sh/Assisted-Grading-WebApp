import React, { Component } from 'react';
import '../App.css';
import { Form1, Input, Button1 } from "reactstrap";
import { withRouter } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import MyJumbotron from "./MyJumbotron";
import { Button, Jumbotron, Navbar, Nav, NavDropdown, Form, FormControl, Card } from 'react-bootstrap'

//configured axios
import axios from './axiosConfig';

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            auth: null
        }

        ReactSession.remove('userdata');

        // this.props.history.replace('/login');   
    }
    // I got CSRF token missing error when I sent the request. So I think we need this.
    // setCSRF = () => {
    //     axios.get('api/set-csrf/').then(res => console.log(res))
    // }

    // testEndpoint = () => {
    //     axios.get('/api/test-auth/').then(res => this.setState(
    //         { endpoint: true }))
    //         .catch(res => this.setState({ endpoint: false }))
    // }

    handleChange = (e) => {
        // console.log(e.target.name, e.target.value);
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/login/',
            {
                username: this.state.username,
                password: this.state.password
            }
        ).then(res => {
            // console.log(res.data);
            let authValue = typeof (res.data) == "object" ? true : false;
            this.setState({ auth: authValue });
        })
            .then(() => {
                if (this.state.auth) {
                    axios.get('/api/me')
                        .then(res => {
                            // ReactSession.set("username" , this.state.username);
                            ReactSession.set("userdata", res.data);
                            this.props.history.push("/");
                        }).catch((err) => {
                            console.log(err);
                            // window.alert("error check console!")
                        })
                }
                else {
                    window.alert("Login failed!");
                }
            })
            // .catch(res => this.setState({ auth: false }))
            .catch((err) => { console.log(err); });
    }

    render() {
        // return <div style={{ marginLeft: '20px' }}>
        //     <div style={{ height: '50px' }}></div>
        //     <button onClick={this.setCSRF}>Set CSRF Token</button>
        //     <div>
        //         {this.state.auth === null ? '' : (this.state.auth ? 'Login successful' : 'Login Failed')}
        //     </div>

        return <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Login Page</Navbar.Brand>

            </Navbar><div className="page-with-form">
                <div className="Login">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleChange} 
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange} 
                            />
                        </Form.Group>
                        <Button block size="lg" type="submit">
                            Login
                        </Button>
                    </Form>
                </div>
                {/* <Form onSubmit={this.handleSubmit}>
                    <Input type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleChange} />
                    <Input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
                    <Button color="primary">log-in</Button>
                </Form> */}
            </div>
        </div>
    };
}

export default withRouter(LoginPage);