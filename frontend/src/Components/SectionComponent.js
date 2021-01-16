import react , {Component} from "react"
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
            photoIsOpen : false
        }

        // this.getQuestionString = this.getQuestionString.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderSectionElements = this.renderSectionElements.bind(this);
        this.renderQuestionButton = this.renderQuestionButton.bind(this);
        
    }

    // getQuestionString(data){
        
    //     var questionlist = []
        
    //     Object.keys(data).forEach(question =>{
    //         var templist = this.getQuestionString(data[question])
    //         if(templist.length===0){
    //             questionlist.push(question)
    //         }
    //         else{
    //             templist.forEach(q=>{
    //                 questionlist.push(question+"-"+q)
    //             })
    //         }
    //     })
    //     return questionlist
    // }

    renderQuestionButton(){
        return Object.keys(this.state.data.QpPattern).map(question => {
             return <QuestionButton
                        ancestor = ""
                        hierarchy = {this.state.data.QpPattern[question]}
                        qno = {question}
                        isVisible = {true}
                        width = {"50%"}
                        handleButtonClick = {this.handleButtonClick}
                />  
        })
    }

    renderButton(segment){
        return (<Button className="sectionbtn" color="secondary" key={segment} >{segment}</Button>)
    }

    handleButtonClick(event){
        if(this.state.isChild==true){
            window.alert(this.state.ancestor+this.state.qno);
        }
        this.setState((prevState)=>{
            return ({
            isExpanded : !prevState.isExpanded
            })
        })
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
                                isSubQuestionVisible={true} 
                                qno={"1"} 
                                subQuestionMarks = {"10"} 
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