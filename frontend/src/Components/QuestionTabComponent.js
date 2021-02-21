import React , {Component} from "react"

export default class QuestionTabComponent extends Component{

    constructor(props){
        
        super(props);

        this.state = {

            ancestor : props.ancestor,

            children : props.children,

            qno : props.qno,

            handler : props.handler
        }

        this.renderChildren = this.renderChildren.bind(this);
    }

    renderChildren(){
        
        let newAncestor = this.state.ancestor.map(x=>x);
        newAncestor.push(this.state.qno);

        let comps = [];
        Object.keys(this.state.children).forEach((child)=>{
            comps.push(<QuestionTabComponent
                        ancestor = {newAncestor}
                        children = {this.state.children[child]}
                        qno = {child}
                        handler = {this.state.handler}
                        />);
        });

        return <div>{comps.map(x=>x)}</div>
    }

    render(){

        console.log("rendered "+this.state)
        return (
            <div style = {{ width : "75%" , border : "1px solid black"}} onClick = {(e)=>{console.log(e);}}>
                {this.state.qno}
                {this.renderChildren()}
            </div>
        );
    }
}