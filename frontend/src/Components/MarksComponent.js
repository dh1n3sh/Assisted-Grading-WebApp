import react , {Component} from "react"

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

    render(){

        return (
            <div style={{border : "5px solid black" , margin : "10%"}}>
                Marks :
                {this.state.isSubQuestionVisible&&<div><span>{this.state.qno}:</span>
                <input type="number" id={this.state.qno} min="0" max={this.state.subQuestionMarks} name={this.state.qno} style={{ width : "50%"}}/>/{this.state.subQuestionMarks}</div>}
                {<div>Total: {this.state.totalMarksAwarded}/{this.state.totalMarks}</div>}
            </div>
        )

    }
}
