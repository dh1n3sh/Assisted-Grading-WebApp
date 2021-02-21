import React , {Component} from "react"
import "./index.css"
import {Button} from "reactstrap"
import ImgsViewer from "react-images-viewer"
import QuestionButton from "./QuestionButton"
import MarksComponent from "./MarksComponent"

export default class SectionComponent extends Component{

    constructor(props){
        
        super(props)

        this.state = {
            width : props.width,
            heading : props.heading,
            data : props.data,
            photoIsOpen : false,
            isSubQuestionVisible : props.isSubQuestionVisible,
            currQno : props.currQno,
            subQuestionMarks : props.subQuestionMarks,
            handleMarkState : props.handleMarkState
        }

        this.renderButton = this.renderButton.bind(this);
        this.renderSectionElements = this.renderSectionElements.bind(this);
        this.renderQuestionButton = this.renderQuestionButton.bind(this);
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        
            return {
                width : nextProps.width,
                heading : nextProps.heading,
                isSubQuestionVisible : nextProps.isSubQuestionVisible,
                currQno : nextProps.currQno,
                subQuestionMarks : nextProps.subQuestionMarks
                
            }
        }

    
    handleButtonClick(event){
        var isVisible = this.state.isChild
        this.state.handleMarkState(isVisible,this.state.ancestor+this.state.qno,this.state.hierarchy);
        this.setState((prevState)=>{
            return ({
            isExpanded : !prevState.isExpanded
            })
        })
    }

    renderQuestionButton(){
        return Object.keys(this.state.data.QpPattern).map(question => {
             return <QuestionButton
                        ancestor = ""
                        hierarchy = {this.state.data.QpPattern[question]}
                        qno = {question}
                        isVisible = {true}
                        width = {"50%"}
                        handleButtonClick = {this.handleButtonClick}
                        handleMarkState = {this.state.handleMarkState}
                />  
        })
    }

    renderButton(segment){
        return (<Button className="sectionbtn" color="secondary" key={segment} >{segment}</Button>)
    }

    renderSectionElements(){
        
        if(this.state.data==undefined) return null;

        switch(this.state.heading){
            case "segments":
                return this.state.data.map(this.renderButton)
            case "questions":
                return this.renderQuestionButton()
            case "answer scripts":
                return <div>
                            <img 
                                onClick={()=>{this.setState({photoIsOpen : true})}} 
                                src={this.state.data}
                                height = "100%"
                                width = "100%"
                                />
                            <ImgsViewer
                                    imgs={[{ src: this.state.data }]}
                                    currImg={this.state.currImg}
                                    isOpen={this.state.photoIsOpen}
                                    onClose={()=>{this.setState({photoIsOpen : false})}}
                                    showThumbnails = {true}
                                    backdropCloseable = {true}
                                />
                        </div>
            case "marks allocation":
                return <div><MarksComponent 
                                isSubQuestionVisible={this.state.isSubQuestionVisible} 
                                qno={this.state.currQno} 
                                subQuestionMarks = {this.state.subQuestionMarks} 
                                totalMarksAwarded = "70" 
                                totalMarks = "100"
                                />
                            <textarea 
                                name="marks remarks" 
                                placeholder="Remarks for the answers." 
                                height="100%" 
                                width="100%"
                                /></div>
            default:
                return <div>yet to be designed</div>

        }
    }

    render(){
        return(
            <div className = "section" style = {{width : this.state.width}}>
                {this.state.heading}
                <div className = "sectionButtonPanel">
                    {this.renderSectionElements()}
                </div>
            </div>
        )
    }
}