import React , {Component} from "react";
import {Form, Input , Button, FormGroup} from "reactstrap";
import SortableTree , {addNodeUnderParent} from "react-sortable-tree";

import QuestionTabComponent from "./QuestionTabComponent";

export default class TestCreationPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            qp : [
                    {
                        title : "1",
                        children : [ { title : "a" } , { title : "b" } ],
                        expanded : true
                    },
                    {
                        title : "2",
                        expanded : true
                    }
                ]
        }
        
        this.renderChildren = this.renderChildren.bind(this);
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

    render(){
        return (
        <div className="page-with-form">
            <Form>
                <FormGroup>
                    <Input type="text" placeholder="Testname"/>
                    <Input type="date" placeholder="Test-date"/>
                    <Input type="number" placeholder="noOfQno"/>
                </FormGroup>
                <div style={{ height : "50vh"}}>
                    <SortableTree
                        treeData = {this.state.qp}
                        onChange = {newQPTree=>{this.setState({newQPTree});}}
                        />
                </div>
               <Button color="secondary">Create Test</Button>
            </Form>
        </div>
        );
    }

}