import React, { Component } from "react";
import { ReactSession } from "react-client-session";
import { withRouter } from "react-router-dom";
import MyJumbotron from "./MyJumbotron";
import DashboardSectionComponent from "./DashboardSectionComponent";
import axios from "./axiosConfig";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, Input } from "reactstrap";
import { Toast } from 'react-bootstrap'
import { Card} from 'react-bootstrap'
import "./index.css"
import FormData from "form-data";
import dw_icon from "./download_icon.png" 
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
            filteredData : [''],
            popup: false,
            toasts: []

        }

        if (props.location.state !== undefined) {
            // let newCurType = props.location.state.curType;
            // let newSelectedFields = props.location.state.selectedFields.map(x=>x);
            // let newData = props.location.state.data;
            this.state.curType = props.location.state.curType;
            this.state.selectedFields = props.location.state.selectedFields.map(x => x);
            this.state.data = props.location.state.data;
            this.state.filteredData = props.location.state.data;
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
        this.toastHandler = this.toastHandler.bind(this);
        this.downloadMarksheet = this.downloadMarksheet.bind(this);
        this.filterResults = this.filterResults.bind(this);
    }

    toastHandler(data) {
        this.setState((prevState) => {
            let newToasts = prevState.toasts.map(x => x)
            newToasts.push(data)
            return {

                toasts: newToasts
            }
        });

    }

    clickhandler(data) {
        document.getElementById("searchFilterInput").value = "";
        this.setState((prevState) => {
            let newSelectedfields = prevState.selectedFields.map(x => x)
            newSelectedfields.push(data)
            return {
                curType: prevState.curType + 1,
                selectedFields: newSelectedfields
            }
        }, () => {
            if (this.state.curType === 3) {
                this.props.history.push({
                    pathname: '/grading',
                    state: this.state,
                    data: data
                });
            }
            else {
                this.props.history.replace('/', this.state)
                this.populateData();
            }
        });

    }

    populateData() {
        axios.get('/api/' + this.state.availableTypes[this.state.curType] + 's/', {
            params: {
                [this.state.availableTypes[this.state.curType - 1]]: this.state.selectedFields.length != 0 ? this.state.selectedFields[this.state.selectedFields.length - 1].id : null
            }
        })
            .then(res => {
                this.setState({ data: res.data , filteredData : res.data })
                console.log(res.data);
            })
    }
    componentDidMount() {
        this.populateData();
    }

    goBack() {
        document.getElementById("searchFilterInput").value = "";
        this.setState((prevState) => {
            let newSelectedfields = prevState.selectedFields.map(x => x);
            newSelectedfields.pop()
            return {
                curType: prevState.curType - 1,
                selectedFields: newSelectedfields
            }
        }, () => {
            this.props.history.replace('/', this.state)
            this.populateData();
        });
    }

    addBtnHandler() {
        if (this.state.curType === 0) {
            this.togglePopup();
        }
        else if (this.state.curType === 1) {
            this.props.history.push({
                pathname: '/test-creation',
                state: this.state
            });
        }
        else {
            //still in development
        }
    }

    togglePopup() {
        this.setState(prevState => { return { popup: !prevState.popup } });
    }

    addCourseBtn() {

        let formData = new FormData(document.getElementById('courseForm'));

        axios.post('/api/courses/', formData)
            .then(res => {
                if (res.status < 300 && res.status > 199) {
                    this.togglePopup();
                    this.populateData();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    downloadMarksheet(){
        
        axios.get('/api/marksheet' , {
            params: {
                test:this.state.selectedFields[this.state.curType-1].id
            }
        })
            .then(res => {

                const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));

                const link = document.createElement('a');

                link.href = downloadUrl;
                let headerLine = res.headers['content-disposition'];
                let startFileNameIndex = headerLine.indexOf('"') + 1
                let endFileNameIndex = headerLine.lastIndexOf('"');
                let filename = headerLine.substring(startFileNameIndex, endFileNameIndex);

                link.setAttribute('download', filename); //any other extension

                document.body.appendChild(link);

                link.click();

                link.remove();

                
                console.log(res);
            })
    }

    filterResults(event){
        const filterString = event.target.value;
        const filterStringLen = filterString.length;
        let filteredData = this.state.data
                                    .filter((ele)=>{
                                                if(ele.name.slice(0,filterStringLen).toLowerCase() === filterString.toLowerCase()) 
                                                    return true;
                                                return false;
                                            });
        
        this.setState({
            filteredData : filteredData
        });

    }

    render() {
        console.log(this.state.data)
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        let variant = 'dark'
        let nav_history = "";
        this.state.selectedFields.forEach(element => {
            if (nav_history === "") nav_history += element.name
            else nav_history += (" > " + element.name)
        });
        return (
            <div
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: 'relative',
                    minHeight: '100px',
                }}>
                <MyJumbotron state={this.state} history={this.props.history} goBack={this.goBack} addBtnHandler={this.addBtnHandler} dontRenderButton={this.state.curType == 2} />
                
                {/* Start of screen info card */}
                <div className = "info-card">
                    <div className = "info-card-title">
                        {this.state.availableTypes[this.state.curType]!= undefined && this.state.availableTypes[this.state.curType]!= null &&
                            capitalize(this.state.availableTypes[this.state.curType])+" Dashboard"
                        }
                        {(this.state.availableTypes[this.state.curType]== undefined || this.state.availableTypes[this.state.curType]== null )&&
                            capitalize("Grading page")
                        }
                    </div>
                    <div className = "info-card-nav">
                        <div style={ { margin : '2vh' , lineHeight : '5vh' , height : '5vh'} }>
                            {nav_history}
                        </div>
                        <Input
                            id = "searchFilterInput" 
                            placeholder ={ 'Search ' + this.state.availableTypes[this.state.curType] } 
                            style = {{ width : '50%'}}
                            onChange = {this.filterResults}></Input>
                        {this.state.curType==2&&
                        <div>
                                
                            <div onClick={this.downloadMarksheet}>
                                        
                                <Card bg={variant.toLowerCase()}
                                text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                                // style={{ width: '10rem', height : '10rem' , margin : '3rem', lineHeight : '10rem'}}
                                style={{ width: '9rem', margin: '2vh' , borderRadius: '10%', height: '3rem' }}>

                                    <Card.Img style={{ position: "relative" }} variant="top" className="img-card img-card-small" />
                                
                                    <img src={dw_icon} 
                                        className="icon-down-tag" style={{ height:"20px"}}></img>
                                    
                                    <Card.Body style={{ borderRadius: '0px' }}>
                                        <Card.Text style={{
                                            fontSize: '1rem', 
                                            fontWeight: 'normal',
                                            fontStretch: 'normal',
                                            fontStyle: 'normal',
                                            lineHeight: '0.7rem',
                                            letterSpacing: 'normal',
                                            textAlign: 'left'
                                        }}>
                                            Marksheet
                                        </Card.Text>

                                    </Card.Body>
                                </Card>
                            </div>
                                    
                        </div>
                        }
                        { this.state.curType !== 2 &&
                        <div>
                            { <Button
                                variant="primary"
                                onClick={this.addBtnHandler}
                                style={{ margin : "2vh" }}
                            > Add {capitalize(this.state.availableTypes[this.state.curType])}</Button>}
                        </div>
                        }
                    </div>
                </div>

                {/* End of screen info card */}
                <div className="dashboard">
                    {console.log("curType is ",this.state.curType,this.state.selectedFields)}
                    
                    {this.state.filteredData.map((obj) => <DashboardSectionComponent data={obj}
                        type={this.state.availableTypes[this.state.curType]}
                        clickHandler={this.clickhandler} populateData={this.populateData}
                        toastHandler={this.toastHandler}
                    />)}
                </div>
                <Modal isOpen={this.state.popup} centered={true}>
                    <ModalHeader>
                        Add a new Course
                        </ModalHeader>
                    <ModalBody>
                        <Form id="courseForm" style={{ height : '50%'}}>
                            <Input type="text" name="course_id" placeholder="Course ID" style={{ marginTop : '5vh'}}/>
                            <Input type="text" name="name" placeholder="Course Name" style={{ marginTop : '5vh'}}/>
                            <Input type="text" name="offering_dept" placeholder="Department Offering" style={{ marginTop : '5vh' , marginBottom : '5vh'}}/>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="danger" onClick={this.togglePopup}>Cancel</Button>
                        <Button type="button" color="primary" onClick={this.addCourseBtn}>Add</Button>
                    </ModalFooter>
                </Modal>
                <div
                    style={{
                        position: 'absolute',
                        top: "5rem",
                        right: "2rem",
                    }}>
                    {

                        this.state.toasts.map((obj, index) => <Toast onClose={() =>
                            this.setState((prevState) => {
                                let newToasts = prevState.toasts.map(x => x)
                                newToasts.splice(index, 1)
                                return {

                                    toasts: newToasts
                                }
                            })}  

                            show={true} delay={3000} autohide
                            >
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded mr-2"
                                    alt=""
                                />
                                <strong className="mr-auto">{obj[0] + " " + obj[1]}</strong>
                                {/* <small>11 mins ago</small> */}
                            </Toast.Header>
                            <Toast.Body style={{ paddingLeft: "1.5rem" }}>{obj[1] + " : " + obj[2]}</Toast.Body>
                        </Toast>)}
                </div>
            </div>
        );
    }
}

export default withRouter(DashboardPage);