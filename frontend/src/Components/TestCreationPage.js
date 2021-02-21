import React, { Component } from "react";
import { Form, Input, Button, FormGroup, Modal , ModalBody , ModalFooter , ModalHeader} from "reactstrap";
import SortableTree, { addNodeUnderParent, removeNodeAtPath , changeNodeAtPath } from "react-sortable-tree";
import MyJumbotron from "./MyJumbotron";

// import JSONViewer from "react-json-viewer";
// import JSONTree from "react-json-tree";
import JSONPretty from "react-json-pretty";
// import {withRouter} from "react-router-dom";

class TestCreationPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            qp: [{
                qno : "qp" ,
                marks : null,
                expanded : true,
                children : []
                }],
            dashboardState : this.props.location.state
        }

        // this.state = {
        //     qp: [{
        //         qno : "qp" ,
        //         marks : null,
        //         expanded : true,
        //         children : [
        //                 {
        //                     qno: "1",
        //                     marks : 10,
        //                     children: [ 
        //                         { qno: "a", marks : 10 , children : [] ,expanded: true }, 
        //                         { qno: "b", marks : 10 , children : [] ,expanded: true }
        //                     ],
        //                     expanded: true
        //                 },
        //                 {
        //                     qno: "2",
        //                     marks : 10,
        //                     children : [],
        //                     expanded: true
        //                 }
        //             ]
        //     }],
        //     popup : false
        // }

        this.renderAddButton = this.renderAddButton.bind(this);
        this.renderDeleteButton = this.renderDeleteButton.bind(this);
        this.constructFinalQpTree = this.constructFinalQpTree.bind(this);
        this.createQp = this.createQp.bind(this);
        // this.togglePopup = this.togglePopup.bind(this);
    }

    // togglePopup(){
    //     this.setState(prevState =>{
    //         return { popup : !prevState.popup}
    //     })
    // }

    createQp(){

        let finalQp = this.constructFinalQpTree(this.state.qp[0].children,"");
        this.setState({
            finalQp : finalQp
        },);
        
    }

    constructFinalQpTree(tree , ancestor){
        let finalqp = {}

        tree.forEach((node)=>{

            let currentQno = ancestor === "" ? node.qno : ancestor + "-" + node.qno;
            
            if(node.children.length === 0){
                finalqp[node.qno] = parseInt(node.marks); 
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
                // let nextq = prompt("enter the new Question no." ,"-");
                // let listOfChildren = node.children !== undefined ? node.children.map(child => child.title) : null;

                // while (listOfChildren != null && listOfChildren.includes(nextq))
                //     nextq = prompt("Duplicate Question no. encountered! Enter the new Question no.","-");
                // nextq = Math.max(node.children) + 1;
                this.setState({
                    qp: addNodeUnderParent({
                        treeData: this.state.qp,
                        newNode: { qno: '-', expanded: true , marks : 0 , children : [] },
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
                        getNodeKey: ({treeIndex}) => treeIndex,
                        ignoreCollapsed: false,
                    })
                })
            }}
        >-</Button>
    }

    render() {
        // console.log(this.state.dashboardState);
        return (
            <div>
                <MyJumbotron state = {this.state.dashboardState} history = {this.props.history} goBack = {()=>{this.props.history.push('/')}} dontRenderButton = {true}/>
                <div className = "page-with-form">
                <Form>
                    <FormGroup>
                        <Input type="text" placeholder="Testname" />
                        <Input type="date" placeholder="Test-date" />
                        {/* <Input type="number" placeholder="noOfQno" /> */}
                    </FormGroup>
                    <div style = {{ height : '30vh'}}>
                        <SortableTree
                            treeData={this.state.qp}
                            onChange={newQPTree => { this.setState({ newQPTree }); }}
                            generateNodeProps={extendedNode => ({
                                title: (
                                    <div>
                                    <input
                                    placeholder = 'Q-no'
                                    style={{ fontSize: '1.1rem' }}
                                    value={extendedNode.node.qno}
                                    readOnly = {extendedNode.node.qno === 'qp'}
                                    onChange={event => {
                                      const name = event.target.value;
                  
                                      this.setState(state => (
                                          {
                                            qp: changeNodeAtPath({
                                                    treeData: state.qp,
                                                    path : extendedNode.path,
                                                    getNodeKey : ({treeIndex}) => {
                                                            return treeIndex;
                                                        },
                                                    newNode: { qno : name , marks : extendedNode.node.marks , expanded : extendedNode.node.expanded , children : extendedNode.node.children }
                                                }),
                                            }));
                                        }}
                                    />
                                    {extendedNode.node.qno!=='qp'&&
                                    <input
                                    placeholder = 'marks'
                                    style={{ fontSize: '1.1rem' }}
                                    value={extendedNode.node.marks}
                                    readOnly = {extendedNode.node.qno === 'qp'}
                                    onChange={event => {
                                      const value = event.target.value;
                  
                                      this.setState(state => (
                                          {
                                            qp: changeNodeAtPath({
                                                    treeData: state.qp,
                                                    path : extendedNode.path,
                                                    getNodeKey : ({treeIndex}) => {
                                                            return treeIndex;
                                                        },
                                                    newNode: { qno : extendedNode.node.qno , marks : value , expanded : extendedNode.node.expanded , children : extendedNode.node.children }
                                                }),
                                            }));
                                        }}
                                    />}
                                    </div>
                                ),
                                buttons: extendedNode.node.qno!=='qp'?[this.renderAddButton(extendedNode.node, extendedNode.path), this.renderDeleteButton(extendedNode)]:[this.renderAddButton(extendedNode.node, extendedNode.path)]
                            })}

                        />
                    </div>
                    {/* <Modal isOpen = {this.state.popup} toggle = {this.togglePopup}>
                        <ModalHeader toggle = {this.togglePopup}>
                            Final Question Paper
                        </ModalHeader>

                        <ModalBody>
                            <JSONViewer json={this.state.finalQp}/>
                            <JSONTree data = {this.state.finalQp}/>
                            <JSONPretty data={this.state.finalQp}/>
                        </ModalBody>
                        <ModalFooter>
                            Question Paper structure can still be changed! Question paper structure generated last will be submitted when test is created.
                        </ModalFooter>
                    </Modal> */}
                    <label>Upload Submissions zip file : </label>
                    <Input type="file" name="zipfile" accept = '.zip,.rar'/>
                    <Button color="primary" onClick={this.createQp}>Create Test</Button>
                </Form>
            </div>
            </div>
        );
    }

}

export default TestCreationPage;