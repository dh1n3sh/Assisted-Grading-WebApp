
import React , {Component} from "react"
import {Button} from "reactstrap"
export default class MarksComponent extends Component{

    constructor(props){

        super(props)
        
        this.state = {
            isSubQuestionVisible : props.isSubQuestionVisible,
            qno : props.qno,
            subQuestionMarks : props.subQuestionMarks,
            totalMarksAwarded : props.totalMarksAwarded,
            totalMarks : props.totalMarks
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
            var newState = {
                isSubQuestionVisible : nextProps.isSubQuestionVisible,
                qno : nextProps.qno,
                subQuestionMarks :  nextProps.subQuestionMarks,
                totalMarksAwarded : nextProps.totalMarksAwarded,
                totalMarks : nextProps.totalMarks
            }
            return newState
    }

    render(){
        return (
            <div style={{border : "5px solid black" , margin : "10%"}}>
                Marks :
                {this.state.isSubQuestionVisible&&<div><span>{this.state.qno}:</span>
                <input type="number" id={this.state.qno} min="0" max={this.state.subQuestionMarks} name={this.state.qno} style={{ width : "50%"}}/>/{this.state.subQuestionMarks}</div>}
                {/* {<div>Total: {this.state.totalMarksAwarded}/{this.state.totalMarks}</div>} */}
                {this.state.isSubQuestionVisible&&<Button 
                    color="secondary" 
                    className="sectionbtn" 
                    onClick={()=>{
                        var value = parseInt(document.getElementById(this.state.qno).value);
                        var total = parseInt(this.state.subQuestionMarks);
                        if(value > total || value < 0)
                            window.alert("Marks entered is invalid for the question!");
                        else
                            window.alert("Entered : "+value+" / "+total);
                    }}
                    >Enter marks</Button>
                }
            </div>
        )

    }
}
