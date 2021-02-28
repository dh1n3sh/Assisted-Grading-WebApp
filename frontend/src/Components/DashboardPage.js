import React, { Component } from "react";
import { ReactSession } from "react-client-session";
import { withRouter } from "react-router-dom";
import MyJumbotron from "./MyJumbotron";
import DashboardSectionComponent from "./DashboardSectionComponent";
import axios from "./axiosConfig";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,Form,Input } from "reactstrap";
import FormData from "form-data";

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            profName: ReactSession.get('userdata')['name'],
            // courseName: undefined,
            // courseId: undefined,
            // testName: undefined,
            // testId: undefined,
            // courseSelected: false,
            curType: 0,
            availableTypes: ['course', 'test', 'submission'],
            selectedFields: [],
            data: [''],
            popup : false
        }

        if(props.location.state !== undefined){
            // let newCurType = props.location.state.curType;
            // let newSelectedFields = props.location.state.selectedFields.map(x=>x);
            // let newData = props.location.state.data;
            this.state.curType= props.location.state.curType;
            this.state.selectedFields = props.location.state.selectedFields.map(x=>x);
            this.state.data = props.location.state.data;
            // props.location.state = undefined;
            // this.setState({
            //     curType : newCurType,
            //     selectedFields : newSelectedFields,
            //     data : newData
            // },()=>{
            //    console.log('setstate') 
            // });

        }

        this.togglePopup = this.togglePopup.bind(this);
        this.clickhandler = this.clickhandler.bind(this);
        this.populateData = this.populateData.bind(this);
        this.goBack = this.goBack.bind(this);
        this.addBtnHandler = this.addBtnHandler.bind(this);
        this.addCourseBtn = this.addCourseBtn.bind(this);
    }

    clickhandler(data) {
        this.setState((prevState) => {
            let newSelectedfields = prevState.selectedFields.map(x=>x)
            newSelectedfields.push(data)
            return {
                curType: prevState.curType + 1,
                selectedFields: newSelectedfields
            }
        }, ()=>{
            if(this.state.curType===3){
                this.props.history.push({
                    pathname : '/grading',
                    state : this.state
                });
            }
            else{
                this.props.history.replace('/',this.state)
                this.populateData();
            }
        });

    }

    populateData() {
        axios.get('/api/' + this.state.availableTypes[this.state.curType] + 's', {
            params: {
                [this.state.availableTypes[this.state.curType - 1]] : this.state.selectedFields.length!=0?this.state.selectedFields[this.state.selectedFields.length - 1].id : null
            }
        })
            .then(res => {
                this.setState({ data: res.data })
                // console.log(res.data);
            })
    }
    componentDidMount() {
        this.populateData();
    }

    goBack() { 
        this.setState((prevState) => {
            let newSelectedfields = prevState.selectedFields.map(x=>x);
            newSelectedfields.pop()
            return {
                curType: prevState.curType - 1,
                selectedFields: newSelectedfields
            }
        },()=>{
            this.props.history.replace('/',this.state)
            this.populateData();
        });
    }

    addBtnHandler(){
        if(this.state.curType===0){
            this.togglePopup();
        }
        else if(this.state.curType===1){
            this.props.history.push({
                pathname : '/test-creation',
                state : this.state
            });
        }
        else{
            //still in development
        }
    }

    togglePopup(){
        this.setState(prevState=>{return{ popup : !prevState.popup }});
    }

    addCourseBtn(){

        let formData = new FormData(document.getElementById('courseForm'));

        axios.post('/api/courses/',formData)
            .then(res=>{
                if(res.status === 200)
                {
                    this.togglePopup();
                    this.populateData();
                }
            })
            .catch(err=>{
                console.log(err);
            });
    }

    render() {

        return (
            <div>
                <MyJumbotron state={this.state} history={this.props.history} goBack={this.goBack} addBtnHandler = {this.addBtnHandler} dontRenderButton = {this.state.curType==2} />
                <div className="dashboard">
                    {this.state.data.map((obj) => <DashboardSectionComponent data={obj} type={this.state.availableTypes[this.state.curType]} clickHandler={this.clickhandler} />)}
                </div>
                 <Modal isOpen = {this.state.popup}>
                        <ModalHeader>
                            Add a new Course
                        </ModalHeader>
                        <ModalBody>
                            <Form id="courseForm">
                                <Input type="text" name="course_id" placeholder="Course ID"/>
                                <Input type="text" name="name" placeholder="Course Name"/>
                                <Input type="text" name="offering_dept" placeholder="Department Offering"/>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" color="danger" onClick={this.togglePopup}>Cancel</Button>
                            <Button type="button" color="primary" onClick={this.addCourseBtn}>Add</Button>
                        </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withRouter(DashboardPage);