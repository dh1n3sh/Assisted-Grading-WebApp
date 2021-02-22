import React, { Component } from "react"
import { ReactSession } from "react-client-session";
import { Button, Jumbotron } from "reactstrap";

class MyJumbotron extends Component {


    // console.log(props);
    render() {

        // console.log(this.props.state.selectedFields);
        return <Jumbotron fluid>
{/* width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around"  */}
            <div>
                <div style={{ width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around"  }}>
                    <div> <Button color='primary' 
                            onClick={this.props.goBack} 
                            disabled={this.props.state.curType === 0}
                            style = {{float : "left"}}
                            > Back </Button></div>
                    
                    {this.props.state.selectedFields.map((indvField)=>{return <div>{indvField.name}</div>})}
                    <div style = {{ display : "flex" , flexDirection : "row" , borderWidth : "5px", borderStyle : "solid" , borderColor : "lightblue" , borderRadius : "10px"}}>
                        <div><h4>{ReactSession.get('userdata')['name']}</h4></div>
                        <div > <Button 
                                    color="danger"
                                    onClick={() => { ReactSession.remove('userdata'); this.props.history.push('/login') }}
                                    style = {{float : "right"}}
                                    > Logout </Button></div>
                    </div>
                </div>
                <div style={{display : "inline-block" , marginLeft : "45vw"}}>
                        <div><h5>{this.props.state.availableTypes[this.props.state.curType]}</h5></div>
                         <div > {this.props.dontRenderButton!=true && <Button 
                                                                        color="primary" 
                                                                        onClick={this.props.addBtnHandler}
                                                                        style = {{ marginLeft : "10px"}}
                                                                        > Add </Button>}</div>
                </div>
            </div>
        </Jumbotron>
    }
}

export default MyJumbotron;