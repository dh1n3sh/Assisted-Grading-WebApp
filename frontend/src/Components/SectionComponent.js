import react , {Component} from "react"
import "./index.css"
import {Button} from "reactstrap"
import ImgsViewer from 'react-images-viewer'

export default class SectionComponent extends Component{

    constructor(props){
        
        super(props)

        this.state = {
            width : props.width,
            heading : props.heading,
            data : props.data
        }

        this.getQuestionString = this.getQuestionString.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderSectionElements = this.renderSectionElements.bind(this);
    }

    getQuestionString(data){
        
        var questionlist = []
        
        Object.keys(data).forEach(question =>{
            var templist = this.getQuestionString(data[question])
            if(templist.length===0){
                questionlist.push(question)
            }
            else{
                templist.forEach(q=>{
                    questionlist.push(question+"-"+q)
                })
            }
        })
        return questionlist
    }

    renderButton(segment){
        return (<Button className="sectionbtn" color="secondary" >{segment}</Button>)
    }

    renderSectionElements(){
        
        if(this.state.data==undefined) return null;

        switch(this.state.heading){
            case "segments":
                return this.state.data.map(this.renderButton)
            case "questions":
                var qppattern = this.state.data.QpPattern;
                var questionlist = this.getQuestionString(qppattern)
                return questionlist.map(this.renderButton)
            case "answer scripts":
                return <ImgsViewer
                            imgs = {[{src : "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"}]}
                            isOpen = {true}
                            currImg={0}
                        />
            default:
                return <div>yet to be designed</div>

        }
    }

    render(){

        return(
            <div className = "section" style = {{width : this.state.width}}>
                {this.state.heading}
                <div className = "sectionButtonPanel" style={{visibility : this.state.data!=undefined}}>
                    {this.renderSectionElements()}
                </div>
            </div>
        )
    }
}