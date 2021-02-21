import React, { Component } from "react";
import { Form, Input, Button, FormGroup, Modal , ModalBody , ModalFooter , ModalHeader} from "reactstrap";
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from "react-sortable-tree";
import JSONViewer from "react-json-viewer";
import JSONTree from "react-json-tree";
import JSONPretty from "react-json-pretty";
import {withRouter} from "react-router-dom";

class TestCreationPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            qp: [
                {
                    qno: "1",
                    children: [{ qno: "a", children : [] ,expanded: true }, { qno: "b", children : [] ,expanded: true }],
                    expanded: true
                },
                {
                    qno: "2",
                    children : [],
                    expanded: true
                }
            ],
            popup : false
        }

        this.renderAddButton = this.renderAddButton.bind(this);
        this.renderDeleteButton = this.renderDeleteButton.bind(this);
        this.constructFinalQpTree = this.constructFinalQpTree.bind(this);
        this.generateQp = this.generateQp.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup(){
        this.setState(prevState =>{
            return { popup : !prevState.popup}
        })
    }

    generateQp(){
        let finalQp = this.constructFinalQpTree(this.state.qp,"");
        this.setState({
            finalQp : finalQp
        });
        
        this.setState({popup : true});
    }

    constructFinalQpTree(tree , ancestor){
        let finalqp = {}

        tree.forEach((node)=>{

            let currentQno = ancestor === "" ? node.qno : ancestor + "-" + node.qno;
            
            if(node.children.length === 0){
                let mark = prompt("Enter the marks for the question " + currentQno + " : " , "0");
                finalqp[node.qno] = mark; 
            }
            else{
                finalqp[node.qno] = this.constructFinalQpTree(node.children , currentQno);
            }
        })

        return finalqp;
    }

    renderAddButton(node, path) {
        // cancelling the prompt still create new child.
        return <Button
            color="primary"
            style={{ borderRadius: "50%" , marginLeft : "5px" , marginRight : "5px"}}
            onClick={(e) => {
                let nextq = prompt("enter the new Question no." ,"-");
                let listOfChildren = node.children !== undefined ? node.children.map(child => child.title) : null;

                while (listOfChildren != null && listOfChildren.includes(nextq))
                    nextq = prompt("Duplicate Question no. encountered! Enter the new Question no.","-");
                // nextq = Math.max(node.children) + 1;
                this.setState({
                    qp: addNodeUnderParent({
                        treeData: this.state.qp,
                        newNode: { qno: nextq, expanded: true , children : [] },
                        parentKey: path[path.length - 1],
                        getNodeKey: ({ treeIndex }) => treeIndex
                    }).treeData
                });
            }}
        >+</Button>
    }
    renderDeleteButton(rowInfo) {
        return <Button
            color="secondary"
            style={{ borderRadius: "50%" , marginLeft : "5px" , marginRight : "5px"}}
            onClick={(e) => {
                let { node, treeIndex, path } = rowInfo;
                this.setState({
                    qp: removeNodeAtPath({
                        treeData: this.state.qp,
                        path: path,   // You can use path from here
                        getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
                            // console.log(number);
                            return number;
                        },
                        ignoreCollapsed: false,
                    })
                })
            }}
        >-</Button>
    }

    render() {
        return (
            <div className="page-with-form">
                <Form>
                    <FormGroup>
                        <Input type="text" placeholder="Testname" />
                        <Input type="date" placeholder="Test-date" />
                        <Input type="number" placeholder="noOfQno" />
                    </FormGroup>
                    <div style={{ height: "50vh" }}>
                        <SortableTree
                            treeData={this.state.qp}
                            onChange={newQPTree => { this.setState({ newQPTree }); }}
                            generateNodeProps={extendedNode => ({
                                title: (
                                    extendedNode.node.qno
                                ),
                                buttons: [this.renderAddButton(extendedNode.node, extendedNode.path), this.renderDeleteButton(extendedNode)]
                            })}
                        />
                    </div>
                    <Modal isOpen = {this.state.popup} toggle = {this.togglePopup}>
                        <ModalHeader toggle = {this.togglePopup}>
                            Final Question Paper
                        </ModalHeader>

                        <ModalBody>
                            {/* <JSONViewer json={this.state.finalQp}/> */}
                            {/* <JSONTree data = {this.state.finalQp}/> */}
                            <JSONPretty data={this.state.finalQp}/>
                        </ModalBody>
                        <ModalFooter>
                            Question Paper structure can still be changed! Question paper structure generated last will be submitted when test is created.
                        </ModalFooter>
                    </Modal>
                    <Button color="secondary" onClick={this.generateQp}>Generate QP</Button><br/>
                    <Button color="primary" onClick={() => { console.log(this.state) }}>Create Test</Button>
                </Form>
            </div>
        );
    }

}

export default TestCreationPage;