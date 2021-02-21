import React, { Component } from 'react';
import '../App.css';
import { Form, Input, Button } from "reactstrap";

// Notice we're importing from the file we created, not the axios package
import axios from './axiosConfig';
export default class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            auth: null
        }
    }
    // I got CSRF token missing error when I sent the request. So I think we need this.
    setCSRF = () => {
        axios.get('api/set-csrf/').then(res => console.log(res))
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/api-auth/login/',
            {
                username: this.state.username,
                password: this.state.password
            }
        ).then(res => {
            this.setState({ auth: true })
        }).catch(res => this.setState({ auth: false }))
        console.log(this.state)
    }
    // testEndpoint = () => {
    //     axios.get('/api/test-auth/').then(res => this.setState(
    //         { endpoint: true }))
    //         .catch(res => this.setState({ endpoint: false }))
    // }
    render() {
        return <div style={{ marginLeft: '20px' }}>
            <div style={{ height: '50px' }}></div>
            <button onClick={this.setCSRF}>Set CSRF Token</button>
            <div>
                {this.state.auth === null ? '' : (this.state.auth ? 'Login successful' : 'Login Failed')}
            </div>
            <div className="page-with-form">
                <Form onSubmit={this.handleSubmit}>
                    <Input type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleChange} />
                    <Input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
                    <Button color="primary">log-in</Button>
                </Form>
            </div>
        </div>
    };
}