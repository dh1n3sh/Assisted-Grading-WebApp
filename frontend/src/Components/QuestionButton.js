import react, {Component} from "react"
import {Button} from "reactstrap"
import "./index.css"


export default class QuestionButton extends Component{

    constructor(props){
        super(props)
        this.state = {
            hierarchy : props.hierarchy,
            ancestor : props.ancestor,
            isExpanded : false,
            isVisible : props.isVisible,
            qno : props.qno,
            width : props.width,
            isChild : false
        }

        if(Object.keys(this.state.hierarchy).length==0) {
            this.state.isChild = true;
        }
        this.reduceWidth = this.reduceWidth.bind(this);
        this.renderChildButtons = this.renderChildButtons.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        
        if(nextProps.isVisible!=prevState.isVisible){
            return {
                hierarchy : prevState.hierarchy,
                ancestor : prevState.ancestor,
                isExpanded : false,
                isVisible : nextProps.isVisible,
                qno : prevState.qno,
                width : prevState.width
            }
        }

        return null
    }

    reduceWidth(width){
        return "60%"
        switch(width){
            case "50%":
                return "45%"
            case "45%":
                return "35%"
            default : 
                return "25%"
        }
    }

    renderChildButtons(){
        console.log("renderchildbuttons called")
        console.log(this.state)
        var children = Object.keys(this.state.hierarchy);

        if(children.length===0) {
            return null;
        }

        return children.map(subquestion=>{
            return <QuestionButton 
                hierarchy = {this.state.hierarchy[subquestion]}
                ancestor = {this.state.ancestor + this.state.qno}
                isVisible = {this.state.isExpanded}
                qno = {subquestion}
                width = {this.reduceWidth(this.state.width)}
            />
        })
    }

    handleButtonClick(event){
        // if(this.state.isChild==true)
        //     window.alert(this.state.ancestor+this.state.qno);
        this.setState((prevState)=>{
            return ({
            isExpanded : !prevState.isExpanded
            })
        })
    }

    render(){
        return (
            <div style={{ display : "flex" , flexDirection : "column" , flexWrap : "wrap" ,alignContent : "flex-end"}}>
                {this.state.isVisible&&
                    <Button
                        className = "sectionbtn"
                        color="secondary"   
                        style={{ width : this.state.width}}
                        onClick={this.handleButtonClick}
                        >
                        {this.state.qno}
                    </Button>
                }   
                {this.renderChildButtons()}
            </div>
        )
    }
}