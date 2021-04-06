
import React , {Component} from "react"
import {Button} from "reactstrap"
export default class MarksComponent extends Component{

    constructor(props){

        super(props)
        
        this.state = {
            isSubQuestionVisible : props.isSubQuestionVisible,
            qno : props.qno,
            subQuestionMarks : props.subQuestionMarks,
            marksGiven : props.marksGiven,
            totalMarksAwarded : props.totalMarksAwarded,
            totalMarks : props.totalMarks,
            enterMarks : props.enterMarks,
            test : props.test
        }

        this.marksUpdate = this.marksUpdate.bind(this)
        this.sendMarkstoParent = this.sendMarkstoParent.bind(this)
        this.getDefaultValue = this.getDefaultValue.bind(this);
        this.getValue = this.getValue.bind(this);
        this.defaultvalue = null;
    }

    static getDerivedStateFromProps(nextProps, prevState) {

            var newState = {
                isSubQuestionVisible : nextProps.isSubQuestionVisible,
                qno : nextProps.qno,
                subQuestionMarks :  nextProps.subQuestionMarks,
                totalMarksAwarded : nextProps.totalMarksAwarded,
                totalMarks : nextProps.totalMarks,
                marksGiven : nextProps.marksGiven,
                test : nextProps.test
            }
            // if(prevState.marksGiven === undefined){
            //     newState.marksGiven = nextProps.marksGiven
            // }
            return newState
    }

    marksUpdate(event){
        let value = event.target.value
        // this.setState({
        //     marksGiven : value
        // })
        this.defaultvalue = value
    }

    sendMarkstoParent(){
        let marksGiven = document.getElementById(this.state.qno).value
        if(marksGiven > this.state.subQuestionMarks || marksGiven < 0){
            window.alert("Invalid marks")
            return
        }
        this.state.enterMarks(this.state.qno,marksGiven)
    }

    getDefaultValue(){
        
        if(this.state.qno === undefined || this.state.test === undefined) return undefined

        let qlist = this.state.qno.split("-");

        qlist.shift()

        return this.getValue(this.state.test.QpPattern,qlist)
    }

    getValue(obj,keylist){
        if(keylist.length === 0){
            return obj[1]
        }

        let curkey = keylist[0]

        keylist.shift();

        return this.getValue(obj[curkey],keylist)
    }

    render(){

        this.defaultvalue = this.getDefaultValue();

        this.nextStyle = {border : "5px solid black" , margin : "10%" , borderColor : ""}

        if(this.state.isSubQuestionVisible&&(isNaN(this.state.defaultvalue)== false || this.defaultvalue > this.state.subQuestionMarks || this.defaultvalue < 0)){
            this.nextStyle.borderColor = "red";
        }

        // console.log("default value : " + this.defaultvalue)
        // console.log(this.state)
        return (
            <div style={this.nextStyle}>
                Marks :
                {this.state.isSubQuestionVisible&&<div><span>{this.state.qno}:</span>
                <input 
                    type="text" 
                    id={this.state.qno} 
                    // min="0" 
                    // max={this.state.subQuestionMarks}
                    name={this.state.qno} 
                    value = {this.defaultvalue}
                    // value = {this.state.marksGiven}
                    // onChange = {this.marksUpdate}
                    onChange = {this.state.enterMarks}
                    style={{ width : "50%"}}/>/{this.state.subQuestionMarks}</div>}
                {/* {<div>Total: {this.state.totalMarksAwarded}/{this.state.totalMarks}</div>} */}
                {/* {this.state.isSubQuestionVisible&&<Button 
                    color="secondary" 
                    className="sectionbtn" 
                    onClick={this.sendMarkstoParent}
                    >Enter marks</Button>
                } */}
                {/* {this.state.isSubQuestionVisible&&(isNaN(this.state.defaultvalue)== false || this.defaultvalue > this.state.subQuestionMarks || this.defaultvalue < 0)&&
                    <label>invalid marks</label>
                } */}
            </div>
        )

    }
}
