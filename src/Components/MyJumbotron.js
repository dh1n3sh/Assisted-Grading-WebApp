import React, { Component } from "react"
import { ReactSession } from "react-client-session";
// import { Button, Jumbotron } from "reactstrap";
import { Button, Navbar, Nav, Card } from 'react-bootstrap'

class MyJumbotron extends Component {
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    // const toggle = () => setDropdownOpen(!dropdownOpen);

    // console.log(props);

    render() {
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        // console.log(this.props)
        let variant = 'dark';
        let nav_history = "";
        this.props.state.selectedFields.forEach(element => {
            if (nav_history === "") nav_history += element.name
            else nav_history += (" - " + element.name)
        });
        let selectedType = this.props.state.availableTypes[this.props.state.curType]
        // if (nav_history === "") nav_history = "Home"
        // console.log(this.props.state.selectedFields);
        return <div>
            <Navbar bg="dark" variant="dark">

                {this.props.state.curType !== 0 &&
                    <Button variant='primary'
                        onClick={this.props.goBack}
                        disabled={this.props.state.curType === 0}
                        style={{ float: "left", marginRight: "1rem" }}
                    > Back </Button>
                }

                <Navbar.Brand>{nav_history}</Navbar.Brand>
                <Nav className="mr-auto">
                    {this.props.dontRenderButton != true && <Button
                        variant="primary"
                        onClick={this.props.addBtnHandler}
                        style={{ marginLeft: "10px" }}
                    > Add {capitalize(this.props.state.availableTypes[this.props.state.curType])}</Button>}
                        
                </Nav>
                {/*selectedType && <Navbar.Brand style={{marginRight: "43rem",  align:"center", weight:"bold"}}>{capitalize(selectedType)+" Dashboard"}</Navbar.Brand>*/}


                {ReactSession.get('userdata') && <Navbar.Brand>{ReactSession.get('userdata')['name']}</Navbar.Brand>}
                {ReactSession.get('userdata') && <Button
                    variant="danger"
                    onClick={() => { ReactSession.remove('userdata'); this.props.history.push('/login') }}
                    style={{ float: "right" }}
                > Logout </Button>}
            </Navbar>
        </div>
        // <Jumbotron fluid bg={variant.toLowerCase()} >
        // {/* width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around"  */}
        //             <div>
        //                 <div style={{ width: "100vw", display: "flex", flexDirection: "row", justifyContent: "space-around"  }}>
        //                     <div> <Button variant='primary' 
        //                             onClick={this.props.goBack} 
        //                             disabled={this.props.state.curType === 0}
        //                             style = {{float : "left"}}
        //                             > Back </Button></div>

        //                     {this.props.state.selectedFields.map((indvField)=>{return <div>{indvField.name}</div>})}
        //                     {/* <div style = {{ display : "flex" , flexDirection : "row" , borderWidth : "5px", borderStyle : "solid" , borderColor : "lightblue" , borderRadius : "10px"}}>
        //                         <div><h4>{ReactSession.get('userdata')['name']}</h4></div>
        //                         <div > <Button 
        //                                     variant="danger"
        //                                     onClick={() => { ReactSession.remove('userdata'); this.props.history.push('/login') }}
        //                                     style = {{float : "right"}}
        //                                     > Logout </Button></div>
        //                     </div> */}

        //                 </div>
        //                 <div style={{display : "inline-block" , marginLeft : "45vw"}}>
        //                         <div><h5>{this.props.state.availableTypes[this.props.state.curType]}</h5></div>
        //                          <div > {this.props.dontRenderButton!=true && <Button 
        //                                                                     variant="primary" 
        //                                                                         onClick={this.props.addBtnHandler}
        //                                                                         style = {{ marginLeft : "10px"}}
        //                                                                         > Add </Button>}</div>
        //                 </div>
        //             </div>
        //         </Jumbotron>
    }
}

export default MyJumbotron;