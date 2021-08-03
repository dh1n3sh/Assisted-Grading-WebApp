import React, { Component } from "react";
import { Form, Input, Button, FormGroup, Modal , ModalBody , ModalFooter , ModalHeader} from "reactstrap";
import SortableTree, { addNodeUnderParent, removeNodeAtPath , changeNodeAtPath } from "react-sortable-tree";
import MyJumbotron from "./MyJumbotron";
// import writeJsonFile from "write-json-file";
import FormData from 'form-data';

// import JSONViewer from "react-json-viewer";
// import JSONTree from "react-json-tree";
// import JSONPretty from "react-json-pretty";
import axios from './axiosConfig';
// import {withRouter} from "react-router-dom";
import checkIcon from '../Data/check.png';

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
            dashboardState : this.props.location.state,
            testname : null,
            testdate : null,
            zipfile : null,
            popup : false
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
        this.handleDataChange = this.handleDataChange.bind(this);
        // this.checkAndPing = this.checkAndPing.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.download_tree = this.download_tree.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup(){
        this.setState(prevState =>{
            return { popup : !prevState.popup}
        })
    }

    isEmpty(obj){
        if(obj === undefined || obj === null) return true;
        let objKey = Object.keys(obj);
        if(objKey.length > 0 ){
            let flag = false;
            objKey.forEach((key)=>{
                if(key === null || key === undefined || key === '' || key == 'null') {
                    flag = true;
                }
            });
            return flag;
        }
        return true;
    }

    handleDataChange(event){
        let { name , value } = event.target;

        this.setState({ [name] : value });
    }

    createQp(){

        let finalQp = this.constructFinalQpTree(this.state.qp[0].children,"");


        if(this.state.testname!=null && this.state.testdate!=null && this.state.zipfile != null && (!this.isEmpty(finalQp) || document.getElementsByName('qp_tree')[0].files[0] )){
        //  if(this.state.testname!=null && this.state.testdate!=null && this.state.zipfile != null ){
                
            // const qptree = Buffer.from(JSON.stringify(this.state.finalQp),'utf-8');
            var qpContent = JSON.stringify(finalQp);
            var qpBlob = new Blob([qpContent], { type  : "application/json"});   
            console.log(qpBlob) 
            const formdata = new FormData();

            formdata.append('name' , document.getElementsByName('testname')[0].value);
            formdata.append('date' , document.getElementsByName('testdate')[0].value);

            if(document.getElementsByName('qp_tree')[0].files[0]){
                formdata.append('qp_tree' , document.getElementsByName('qp_tree')[0].files[0]);
            }
            else if(!this.isEmpty(finalQp)){
                formdata.append('qp_tree' , qpBlob , this.state.testname+'_qp_tree.json');
            }
            formdata.append('answer_scripts' , document.getElementsByName('zipfile')[0].files[0]);
            formdata.append('course' , this.state.dashboardState.selectedFields[0].id);

            axios.post('/api/tests/',formdata)
                .then((res)=>{
                    // console.log(res);
                    if(res.status==200){
                        window.alert('Test created !');
                        this.props.history.push('/'); 
                    }
                    else{
                        window.alert("" + res.status + res.statusText);
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
            return;
            // console.log(document.getElementsByName('zipfile')[0].value);
        }
        
        window.alert('Please fill all the fields and create Qp Tree if not created!');
        
    }

    download_tree(){
       let finalQp = this.constructFinalQpTree(this.state.qp[0].children,"");
               var qpContent = JSON.stringify(finalQp);
                var qpBlob = new Blob([qpContent], { type  : "application/json"});   
                console.log(qpBlob,qpContent ) 

                const downloadUrl = window.URL.createObjectURL(qpBlob);

                const link = document.createElement('a');

                link.href = downloadUrl;
                

                link.setAttribute('download', 'qp_tree.json'); //any other extension

                document.body.appendChild(link);

                link.click();

                link.remove();

                
                // console.log(res);
        
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
                        newNode: { qno: null, expanded: true , marks : null , children : [] },
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
        let nav_history = "";
        this.state.dashboardState.selectedFields.forEach(element => {
            if (nav_history === "") nav_history += element.name
            else nav_history += (" > " + element.name)
        });
        const capitalize = (s) => {
          if (typeof s !== 'string') return ''
          return s.charAt(0).toUpperCase() + s.slice(1)
        }
        return (
            <div>
                <MyJumbotron state = {this.state.dashboardState} history = {this.props.history} goBack = {()=>{this.props.history.push({pathname : '/',state : this.state.dashboardState})}} dontRenderButton = {true}/>
                {/* Start of screen info card */}
                <div className = "info-card">
                    <div className = "info-card-title">
                        { capitalize("New Test") }
                    </div>
                    <div className = "info-card-nav">
                        <div style={ { margin : '2vh' , lineHeight : '5vh' , height : '5vh'} }>
                            {nav_history}
                        </div>
                    </div>
                </div>
                {/* End of screen info card */}

                <div className = "page-with-form">
                <Form id='id'>
                    <FormGroup>
                        <div className='page-with-form-section'>
                            <h5>Test Details :</h5>
                            <div style={{ display : 'flex' , flexDirection : 'row' }}>
                                <Input name="testname" type="text" placeholder="Testname" required={true} value={this.state.testname} onChange={this.handleDataChange} style={{ marginLeft : '5vh' , marginRight : '5vh'}}/>
                                <Input name="testdate" type="date" placeholder="Test-date" required={true} value = {this.state.testdate} onChange={this.handleDataChange} style={{ marginLeft : '5vh' , marginRight : '5vh'}}/>
                            </div>
                        </div>
                        <div className='page-with-form-section'>
                            <h5>Question Paper structure :</h5>
                            <div>
                                <div>
                                    <label><strong>Create/Edit Question Paper Structure :</strong></label><br/>
                                    <Button color="primary" onClick={this.togglePopup}>Question Paper Structure</Button> 
                                    {!this.isEmpty(this.constructFinalQpTree(this.state.qp[0].children,"")) &&
                                        <img src={checkIcon} style={{ marginLeft : '5vh'}}></img>}
                                </div>
                                <div style = {{ width : '100%' , textAlign : 'center'}}>
                                    ( OR )
                                </div>
                                <div>
                                    <label><strong> You can also upload an already created Question Paper Structure instead of creating one fresh! </strong></label>
                                    <Input type="file" accept="application/json" name="qp_tree"/>
                                    <label>(Accepted file format : JSON)</label>
                                </div>
                            </div>
                        </div>
                        <div className='page-with-form-section'>
                            <h5>Add Answer sheets :</h5> 
                            <div>
                                <label><strong>Upload Submissions zip file : </strong></label>
                                <Input type="file" name="zipfile" accept = '.zip,.rar' required = {true} value={this.state.zipfile} onChange={this.handleDataChange}/>
                            </div>
                        </div>
                        <Button color="primary" onClick={this.createQp} style={{ marginRight : '40%' , marginLeft : '40%'}}>Create Test</Button>
                    </FormGroup>
                    
                    <Modal isOpen = {this.state.popup} toggle = {this.togglePopup} size="lg" centered={true}>
                        <ModalHeader toggle = {this.togglePopup}>
                            Question paper structure
                        </ModalHeader>

                        <ModalBody>
                            <div style = {{ height : '60vh' , width : '50vw'}}>
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
                            <Button color="primary" onClick={this.download_tree}>Download the above QP Tree in JSON format</Button>
                        </ModalBody>
                        <ModalFooter>
                            <div style={{ color : '#007bff'}}>Question Paper structure can still be changed! Question paper structure is finalised when test is created.</div>
                        </ModalFooter>
                    </Modal>
                    
                </Form>
            </div>
            </div>
        );
    }

}

export default TestCreationPage;