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
        this.renderButton =  this.renderButton.bind(this);
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

    renderButton(node, path){
        return <Button color="primary" style={{borderRadius : "50%"}} onClick = {(e)=>{window.alert(node.title+"-"+path)}}>+</Button>
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
                        generateNodeProps={extendedNode => ({
                            title: (
                                <a href={extendedNode.node.url}>{extendedNode.node.title}</a>
                            ),
                            buttons: [this.renderButton(extendedNode.node,extendedNode.path)]
                        })}
                        />
                </div>
               <Button color="primary">Create Test</Button>
            </Form>
        </div>
        );
    }

}