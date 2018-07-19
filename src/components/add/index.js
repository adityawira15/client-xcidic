import React, { Component } from 'react'
import request from 'superagent'
import * as server from '../../content/url'
import './add.css'

export default class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            disease: '',
            otherdisease: '',
            arrotherdisease: [],
            testtool: '',
            arrtesttool: [],
            presentation: '',
            arrpresentation: [],
            message: ''
        }
        this.namePatient = this.namePatient.bind(this)
        this.emailPatient = this.emailPatient.bind(this)
        this.disease = this.disease.bind(this)
        this.otherDisease = this.otherDisease.bind(this)
        this.addDisease = this.addDisease.bind(this)
        this.testTool = this.testTool.bind(this)
        this.addTools = this.addTools.bind(this)
        this.presentation = this.presentation.bind(this)
        this.addPresentation = this.addPresentation.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
        this.alerts = this.alerts.bind(this)
    }

    namePatient(e) {
        this.setState({ name: e.target.value })
    }

    emailPatient(e) {
        this.setState({ email: e.target.value })
    }

    disease(e) {
        this.setState({ disease: e.target.value })
    }

    otherDisease(e) {
        this.setState({ otherdisease: e.target.value })
    }

    addDisease(disease) {
        this.setState({
            arrotherdisease: [disease, ...this.state.arrotherdisease],
            otherdisease: ''
        })
    }

    testTool(e) {
        this.setState({ testtool: e.target.value })
    }

    addTools(tool) {
        this.setState({
            arrtesttool: [tool, ...this.state.arrtesttool],
            testtool: ''
        })
    }

    presentation(e) {
        this.setState({ presentation: e.target.value })
    }

    addPresentation(presentation) {
        this.setState({
            arrpresentation: [presentation, ...this.state.arrpresentation],
            presentation: ''
        })
    }

    handleAdd() {
        request
            .post(server.SERVER_URL + '/adddata')
            .send({
                name: this.state.name,
                email: this.state.email,
                disease: this.state.disease,
                diseases: this.state.arrotherdisease,
                tools: this.state.arrtesttool,
                presentations: this.state.arrpresentation
            })
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) throw err
                let data = JSON.parse(response.text)
                if(data.status){
                    this.setState({
                        name: '',
                        email: '',
                        disease: '',
                        otherdisease: '',
                        arrotherdisease: [],
                        testtool: '',
                        arrtesttool: [],
                        presentation: '',
                        arrpresentation: []
                    })
                    this.props.handleDisplay()
                    this.props.handleMessage(data.message)
                }else{
                    this.handleMessage(data.message)
                }
            })
    }

    handleMessage(message){
        this.setState({message: message})
        setTimeout(() => {
            this.setState({message: ''})
        }, 5000)
    }

    alerts() {
        if (this.state.message !== '') {
            return (
                <p className="bg-danger alert" style={{color: "#460303"}}>{this.state.message}</p>
            )
        }
    }

    render() {
        return (
            <div className="modal" style={{ display: this.props.display }}>
                <div className="modal-content" style={{ width: 50 + "%" }}>
                    <div className="modal-header">
                        <span className="close" onClick={this.props.handleDisplay}>&times;</span>
                        <h2>Add</h2>
                    </div>
                    <div className="modal-body">
                        <form style={{ margin: 20 }}>
                            {this.alerts()}
                            <h3>Data Patient</h3>
                            <div className="form-group">
                                <label htmlFor="namePatient">Name Patient</label>
                                <input type="text" className="form-control" id="namePatient" placeholder="Email" onChange={this.namePatient} value={this.state.name} style={{ width: 90 + "%" }} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Patient</label>
                                <input type="email" className="form-control" id="email" placeholder="Email Patient" onChange={this.emailPatient} value={this.state.email} style={{ width: 90 + "%" }} />
                            </div>
                            <br />
                            <h3>Diagnostic</h3>
                            <div className="form-group">
                                <label htmlFor="disease">Disease</label>
                                <input type="text" className="form-control" id="disease" placeholder="Disease" onChange={this.disease} value={this.state.disease} style={{ width: 90 + "%" }} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="otherDisease">Other possible features</label>
                                <div className="form-inline">
                                    <input type="text" className="form-control" id="otherDisease" placeholder="Other Disease" onChange={this.otherDisease} value={this.state.otherdisease} style={{ width: 90 + "%" }} />
                                    <button type="button" className="btn btn-danger" onClick={() => this.addDisease(this.state.otherdisease)} style={{ marginLeft: 10, borderRadius: 100 + "%" }}><span className="glyphicon glyphicon-plus" aria-hidden="true" /></button>
                                </div>
                            </div>
                            <div className="form-group">
                                <ul>
                                    {this.state.arrotherdisease.map((val) => {
                                        return (
                                            <li>{val}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="form-group">
                                <label htmlFor="testTool">Test Tools</label>
                                <div className="form-inline">
                                    <input type="text" className="form-control" id="testTool" placeholder="Test Tools" onChange={this.testTool} value={this.state.testtool} style={{ width: 90 + "%" }} />
                                    <button type="button" className="btn btn-danger" onClick={() => this.addTools(this.state.testtool)} style={{ marginLeft: 10, borderRadius: 100 + "%" }}><span className="glyphicon glyphicon-plus" aria-hidden="true" /></button>
                                </div>
                            </div>
                            <div className="form-group">
                                <ul>
                                    {this.state.arrtesttool.map((val) => {
                                        return (
                                            <li>{val}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="form-group">
                                <label htmlFor="presentaion">Presentation</label>
                                <div className="form-inline">
                                    <input type="text" className="form-control" id="presentaion" placeholder="Presentation" onChange={this.presentation} value={this.state.presentation} style={{ width: 90 + "%" }} />
                                    <button type="button" className="btn btn-danger" onClick={() => this.addPresentation(this.state.presentation)} style={{ marginLeft: 10, borderRadius: 100 + "%" }}><span className="glyphicon glyphicon-plus" aria-hidden="true" /></button>
                                </div>
                            </div>
                            <div className="form-group">
                                <ul>
                                    {this.state.arrpresentation.map((val) => {
                                        return (
                                            <li>{val}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-info" onClick={this.handleAdd}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}