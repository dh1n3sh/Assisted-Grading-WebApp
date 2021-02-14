import React , {Component} from "react";
import {Form, Input , Button, FormGroup} from "reactstrap";

import QuestionTabComponent from "./QuestionTabComponent";

export default class TestCreationPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            qp : { "1" : {"a" :[],"b":[]},"2" : {"a":[]}}
        }

        // this.handleClick = this.handleClick.bind(this);
        this.renderChildren = this.renderChildren.bind(this);
        // this.handler = this.handler.bind(this);
    }

    renderChildren(){

        console.log(Object.keys(this.state.qp));

        let comps = []
        
        Object.keys(this.state.qp).forEach((child)=>{
            comps.push(<QuestionTabComponent
                        ancestor = {[]}
                        children = {this.state.qp[child]}
                        qno = {child}
                        handler = {null}
                        />);
        });

        return <div>{comps.map(x=>x)}</div>;
    }

    // handler(ancestor,qno,newqno){
    //     this.setState((prevState)=>{
            
    //     })
    // }

    // recTraverse(tree,l,newq){
        
    //     if(l.length==1){
    //         if(tree[l])
    //     }
    // }

    render(){
        return (
        <div className="page-with-form">
            <Form>
                <FormGroup>
                    <Input type="text" placeholder="Testname"/>
                    <Input type="date" placeholder="Test-date"/>
                    <Input type="number" placeholder="noOfQno"/>
                </FormGroup>
                {/* {this.renderChildren()} */}
                <Input type="file" accept="application/json"></Input>
                <Button color="secondary">Create Test</Button>
            </Form>
        </div>
        );
    }

}