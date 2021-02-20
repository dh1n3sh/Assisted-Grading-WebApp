import React, { Component } from "react";
import { Form, Input, Button, FormGroup } from "reactstrap";
import SortableTree, { addNodeUnderParent, defaultGetNodeKey, removeNodeAtPath } from "react-sortable-tree";

import QuestionTabComponent from "./QuestionTabComponent";

export default class TestCreationPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            qp: [
                {
                    qno: "1",
                    children: [{ qno: "a", expanded: true }, { qno: "b", expanded: true }],
                    expanded: true
                },
                {
                    qno: "2",
                    expanded: true
                }
            ],
            treeIdCounter: 4
        }

        this.renderChildren = this.renderChildren.bind(this);
        this.renderButton = this.renderButton.bind(this);
    }

    renderChildren() {

        console.log(Object.keys(this.state.qp));

        let comps = []

        Object.keys(this.state.qp).forEach((child) => {
            comps.push(<QuestionTabComponent
                ancestor={[]}
                children={this.state.qp[child]}
                qno={child}
                handler={null}
            />);
        });

        return <div>{comps.map(x => x)}</div>;
    }

    renderButton(node, path) {
        // cancelling the prompt still create new child.
        return <Button
            color="primary"
            style={{ borderRadius: "50%" }}
            onClick={(e) => {
                let nextq = prompt("enter the new Question no.");
                let listOfChildren = node.children !== undefined ? node.children.map(child => child.title) : null;

                while (listOfChildren != null && listOfChildren.includes(nextq))
                    nextq = prompt("Duplicate Question no. encountered! Enter the new Question no.");
                // nextq = Math.max(node.children) + 1;
                this.setState({
                    qp: addNodeUnderParent({
                        treeData: this.state.qp,
                        newNode: { qno: nextq, expanded: true },
                        parentKey: path[path.length - 1],
                        getNodeKey: ({ treeIndex }) => treeIndex
                    }).treeData
                });
            }}
        >+</Button>
    }
    renderDeleteButton(rowInfo) {
        return <Button
            color="secondary"
            style={{ borderRadius: "50%" }}
            onClick={(e) => {
                let { node, treeIndex, path } = rowInfo;
                this.setState({
                    treeData: removeNodeAtPath({
                        treeData: this.state.treeData,
                        path: path,   // You can use path from here
                        getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
                            // console.log(number);
                            return number;
                        },
                        ignoreCollapsed: false,
                    })
                })
            }}
        >-</Button>
    }

    render() {
        return (
            <div className="page-with-form">
                <Form>
                    <FormGroup>
                        <Input type="text" placeholder="Testname" />
                        <Input type="date" placeholder="Test-date" />
                        <Input type="number" placeholder="noOfQno" />
                    </FormGroup>
                    <div style={{ height: "50vh" }}>
                        <SortableTree
                            treeData={this.state.qp}
                            onChange={newQPTree => { this.setState({ newQPTree }); }}
                            generateNodeProps={extendedNode => ({
                                title: (
                                    extendedNode.node.qno
                                ),
                                buttons: [this.renderButton(extendedNode.node, extendedNode.path), this.renderDeleteButton(extendedNode)]
                            })}
                        />
                    </div>
                    <Button color="primary" onClick={() => { console.log(this.state) }}>Create Test</Button>
                </Form>
            </div>
        );
    }

}