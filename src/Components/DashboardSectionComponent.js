import React, { Component } from "react";
import axios from "./axiosConfig";
import { Card, Toast } from 'react-bootstrap'
import "./index.css"

export default class DashboardSectionComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            type: this.props.type,
            clickHandler: this.props.clickHandler,
            populateData: this.props.populateData,
            toastHandler: this.props.toastHandler,
        }

        this.deleteBtn = this.deleteBtn.bind(this);

    }

    static getDerivedStateFromProps(props, state) {
        // if(props === state)

        let newState = {
            data: props.data,
            type: props.type,
            clickHandler: props.clickHandler
        }
        return newState
    }

    deleteBtn(event) {
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
          }
        event.stopPropagation();
        axios.delete('/api/' + this.state.type + 's/' + this.state.data.id.toString() + '/')
            .then((res) => {
                // console.log(res);
                if (res.status < 300 && res.status > 199) {
                    this.state.toastHandler(["Deleted",capitalize(this.state.type), this.state.data.id.toString()]);
                    this.state.populateData();
                    // window.alert(this.state.type + ' deleted !');
                    
                }
                else {
                    window.alert(res.message);
                    console.log(res);
                }
            });
    }

    render() {
        
        // return <div className="dashboard-section" onClick={(e) => { this.state.clickHandler(this.state.data) }}>
        //             {this.state.data.name}
        //             <img 
        //                 src='/delete-24px.svg' 
        //                 alt="del logo" 
        //                 style={{ float : 'right' , marginRight : '10px' , marginTop : '10px'}}
        //                 onClick={this.deleteBtn}
        //                 />
        //         </div>>
        //     bg={variant.toLowerCase()}
        //     text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
        //     style={{ width: '10rem', height : '10rem' , margin : '3rem', lineHeight : '10rem'}}
        //     >
        //         <img src="/delete-24px.svg"/>
        //     <Card.Text>{this.state.data.name}</Card.Text>

        // </Card>;
        let variant = 'dark'
        return <div onClick={(e) => { this.state.clickHandler(this.state.data) }}>
            <Card bg={variant.toLowerCase()}
                text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                // style={{ width: '10rem', height : '10rem' , margin : '3rem', lineHeight : '10rem'}}
                style={{ width: '13rem', margin: '2rem', borderRadius: '20px', height: '10rem' }}>

                <Card.Img style={{ position: "relative" }} variant="top" className="img-card img-card-small" />
                <div className="blue-circle-icon">
                    <img src={"./icons8-delete-bin-24-white.png"}
                        alt="live-icon"
                        className="icon-tag"
                        onClick={this.deleteBtn} />
                </div>

                <Card.Body style={{ borderRadius: '5px' }}>
                    <Card.Text style={{
                        fontSize: '1rem',
                        fontWeight: 'normal',
                        fontStretch: 'normal',
                        fontStyle: 'normal',
                        lineHeight: '7rem',
                        letterSpacing: 'normal',
                        textAlign: 'center'
                    }}>
                        {this.state.data.name}
                    </Card.Text>
                </Card.Body>
            </Card>
            {/* {this.state.data.map((obj) => <DashboardSectionComponent data={obj} type={this.state.availableTypes[this.state.curType]} clickHandler={this.clickhandler} populateData={this.populateData} />)} */}



           
        </div>
    }
}