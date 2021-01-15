import react , {Component} from "react"
import "./index.css"
import {Button} from "reactstrap"

export default class SectionComponent extends Component{

    constructor(props){
        
        super(props)

        this.state = {
            width : props.width,
            heading : props.heading
        }

        this.renderButton = this.renderButton.bind(this);
    }

    componentDidMount(){
        if(this.props.heading==="segments"){
            this.setState({data : this.props.data});
        }
    }

    renderButton(segment){
        return (<Button className="sectionbtn" color="secondary" >{segment}</Button>)
    }

    render(){

        return(
            <div className = "section" style = {{width : this.state.width}}>
                {this.state.heading}
                <div className = "sectionButtonPanel" style={{visibility : this.state.data!=undefined}}>
                    {this.state.data==undefined?null:this.state.data.map(this.renderButton)}
                </div>
            </div>
        )
    }
}