import React, {Component} from "react"
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
            isChild : false,
            handleButtonClick : props.handleButtonClick,
            handleMarkState : props.handleMarkState
        }

        if(Object.keys(this.state.hierarchy).length==0 || this.state.hierarchy instanceof Array) {
            this.state.isChild = true;
        }
        
        this.renderChildButtons = this.renderChildButtons.bind(this);
        this.handleButtonClick = this.state.handleButtonClick;
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

    renderChildButtons(){
        var children = Object.keys(this.state.hierarchy);

        if(children.length===0 || this.state.hierarchy instanceof Array) {
            return null;
        }

        return children.map(subquestion=>{
            return <QuestionButton 
                hierarchy = {this.state.hierarchy[subquestion]}
                ancestor = {this.state.ancestor + "-" + this.state.qno}
                isVisible = {this.state.isExpanded}
                qno = {subquestion}
                width = {"60%"}
                handleButtonClick = {this.state.handleButtonClick}
                handleMarkState = {this.state.handleMarkState}
            />
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