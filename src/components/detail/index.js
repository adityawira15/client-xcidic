import React, { Component } from 'react'
import jwt from 'jsonwebtoken'
import request from 'superagent'
import * as server from '../../content/url'
import { Link } from 'react-router-dom'

export default class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            disease: '',
            diseases: [],
            tools: [],
            presentations: [],
            edit: false,
            message: '',
            adddisease: '',
            addtool: '',
            addpresentation: '',
            displaydisease: 'none',
            displaytool: 'none',
            displaypresentation: 'none'
        }
        this.handleSignout = this.handleSignout.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleButton = this.handleButton.bind(this)
        this.buttonEdit = this.buttonEdit.bind(this)
        this.disease = this.disease.bind(this)
        this.addArray = this.addArray.bind(this)
        this.editArray = this.editArray.bind(this)
        this.deleteArray = this.deleteArray.bind(this)
    }

    componentWillMount() {
        request
            .get(server.SERVER_URL + '/detail/' + this.props.match.params.id)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) throw err
                let data = JSON.parse(response.text)
                this.setState({
                    name: data.data.name,
                    email: data.data.email,
                    disease: data.data.disease,
                    diseases: JSON.parse(data.data.diseases),
                    tools: JSON.parse(data.data.tools),
                    presentations: JSON.parse(data.data.presentations)
                })
            })
    }

    handleSignout() {
        let token = localStorage.getItem('token')
        let verify = jwt.verify(token, 'testxcidic')
        request
            .get(server.SERVER_URL_USER + '/signout/' + verify.id)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err) throw err
                localStorage.clear()
            })
    }

    handleButton(type) {
        if (type === 'edit') {
            this.setState({ edit: true })
        } else if (type === 'cancle') {
            request
                .get(server.SERVER_URL + '/detail/' + this.props.match.params.id)
                .set('Accept', 'application/json')
                .end((err, response) => {
                    if (err) throw err
                    let data = JSON.parse(response.text)
                    this.setState({
                        name: data.data.name,
                        email: data.data.email,
                        disease: data.data.disease,
                        diseases: JSON.parse(data.data.diseases),
                        tools: JSON.parse(data.data.tools),
                        presentations: JSON.parse(data.data.presentations),
                        edit: false
                    })
                })
        } else if (type === 'save') {
            request
                .post(server.SERVER_URL + '/editdata/' + this.props.match.params.id)
                .send({
                    disease: this.state.disease,
                    diseases: this.state.diseases,
                    tools: this.state.tools,
                    presentations: this.state.presentations
                })
                .set('Accept', 'application/json')
                .end((err, response) => {
                    if (err) {
                        request
                            .get(server.SERVER_URL + '/detail/' + this.props.match.params.id)
                            .set('Accept', 'application/json')
                            .end((err, response) => {
                                if (err) throw err
                                let data = JSON.parse(response.text)
                                this.setState({
                                    name: data.data.name,
                                    email: data.data.email,
                                    disease: data.data.disease,
                                    diseases: JSON.parse(data.data.diseases),
                                    tools: JSON.parse(data.data.tools),
                                    presentations: JSON.parse(data.data.presentations),
                                    edit: false,
                                    message: 'Gagal Update!'
                                })
                            })
                    } else {
                        let data = JSON.parse(response.text)
                        this.setState({
                            message: data.message,
                            edit: false
                        })
                    }
                })
        }
    }

    buttonEdit() {
        let token = localStorage.getItem('token')
        let data = jwt.verify(token, 'testxcidic')
        if (data.type === 'Doctor') {
            return (
                <div className="row">
                    <div className="col-md-10">
                    </div>
                    <div className="col-md-1">
                        <p><button className="btn btn-primary btn-lg" onClick={() => this.handleButton('edit')}>Edit</button></p>
                    </div>
                </div>
            )
        }
    }

    handleAdd(e, type){
        if(type === 'diseases'){
            this.setState({
                adddisease: e.target.value
            })
        }else if(type === 'tools'){
            this.setState({
                addtool: e.target.value
            })
        }else if(type === 'presentations'){
            this.setState({
                addpresentation: e.target.value
            })
        }

    }

    handleEdit() {
        if (this.state.edit) {
            return (
                <div className="jumbotron">
                    <h2><b>Diagnostic</b></h2>
                    <input className="form-control" type="text" placeholder="Disease" onChange={this.disease} value={this.state.disease} style={{ width: '30%' }} />
                    <h3> <b> kemungkinan penyakit lainnya</b> </h3>
                    <div className="row">
                        <div className="col-xs-2" style={{display: this.state.displaydisease}} >
                            <input className="form-control" type="text" placeholder="Add Diseases" onChange={(text) => this.handleAdd(text, 'diseases')} value={this.state.adddisease} style={{width: '100%'}} />
                        </div>
                        <div className="col-xs-1" style={{ width: 0, marginTop: '5px' }} >
                            <button type="button" className="btn btn-primary" onClick={() => this.addArray(this.state.adddisease, 'diseases')} style={{ padding: '0 5px', borderRadius: '100%' }} >+</button>
                        </div>
                    </div>
                    <br />
                    <ul>
                        {this.state.diseases.map((val, index) => {
                            return (
                                <li key={index} id="diseases" style={{ listStyleType: 'none', paddingLeft: 0, marginLeft: 0 }}>
                                    <div className="row">
                                        <div className="col-xs-1" style={{ width: 0, marginTop: '5px' }}>
                                            <button className="btn btn-danger" type="button" onClick={() => this.deleteArray(index, 'diseases')} style={{ borderRadius: '100%', padding: '0 7px', marginTop: 0 }} >-</button>
                                        </div>
                                        <div className="col-xs-11">
                                            <input className="form-control" type="text" placeholder={val} onChange={(text) => this.editArray(text, index, 'diseases')} style={{ width: '30%' }} />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <p><b>Tests: </b></p>
                    <div className="row">
                        <div className="col-xs-2" style={{display: this.state.displaytool}} >
                            <input className="form-control" type="text" placeholder="Add Tools" onChange={(text) => this.handleAdd(text, 'tools')} value={this.state.addtool} style={{width: '100%'}} />
                        </div>
                        <div className="col-xs-1" style={{ width: 0, marginTop: '5px' }} >
                            <button type="button" className="btn btn-primary" onClick={() => this.addArray(this.state.addtool, 'tools')} style={{ padding: '0 5px', borderRadius: '100%' }} >+</button>
                        </div>
                    </div>
                    <br />
                    <ul>
                        {this.state.tools.map((val, index) => {
                            return (
                                <li key={index} id="tools" style={{ listStyleType: 'none', paddingLeft: 0, marginLeft: 0 }}>
                                    <div className="row">
                                        <div className="col-xs-1" style={{ width: 0, marginTop: '5px' }}>
                                            <button className="btn btn-danger" type="button" onClick={() => this.deleteArray(index, 'tools')} style={{ borderRadius: '100%', padding: '0 7px', marginTop: 0 }} >-</button>
                                        </div>
                                        <div className="col-xs-11">
                                            <input className="form-control" type="text" placeholder={val} onChange={(tool) => this.editArray(tool, index, 'tools')} style={{ width: '10%' }} />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <h2> presentasi </h2>
                    <div className="row">
                        <div className="col-xs-2" style={{display: this.state.displaypresentation}} >
                            <input className="form-control" type="text" placeholder="Add Presentations" onChange={(text) => this.handleAdd(text, 'presentations')} value={this.state.addpresentation} style={{width: '100%'}} />
                        </div>
                        <div className="col-xs-1" style={{ width: 0, marginTop: '5px' }} >
                            <button type="button" className="btn btn-primary" onClick={() => this.addArray(this.state.addpresentation, 'presentations')} style={{ padding: '0 5px', borderRadius: '100%' }} >+</button>
                        </div>
                    </div>
                    <br />
                    <ul>
                        {this.state.presentations.map((val, index) => {
                            return (
                                <li key={index} id="presentations" style={{ listStyleType: 'none', paddingLeft: 0, marginLeft: 0 }}>
                                    <div className="row">
                                        <div className="col-xs-1" style={{ width: 0, marginTop: '5px' }}>
                                            <button className="btn btn-danger" type="button" onClick={() => this.deleteArray(index, 'presentations')} style={{ borderRadius: '100%', padding: '0 7px', marginTop: 0 }} >-</button>
                                        </div>
                                        <div className="col-xs-11">
                                            <input className="form-control" type="text" placeholder={val} onChange={(presentation) => this.editArray(presentation, index, 'presentations')} style={{ width: '50%' }} />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="row">
                        <div className="col-md-9">
                        </div>
                        <div className="col-md-1">
                            <p><button className="btn btn-warning btn-lg" onClick={() => this.handleButton('cancle')}>Cancle</button></p>
                        </div>
                        <div className="col-md-1">
                            <p><button className="btn btn-success btn-lg" onClick={() => this.handleButton('save')}>Save</button></p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="jumbotron">
                    <h2><b>Diagnostic</b></h2>
                    <p>{this.state.disease}</p>
                    <h3> <b> kemungkinan penyakit lainnya</b> </h3>
                    <ul>
                        {this.state.diseases.map((val, index) => {
                            return (
                                <li key={index}>{val}</li>
                            )
                        })}
                    </ul>
                    <p><b>Tests: </b>{this.state.tools.join(', ')}</p>
                    <h2> presentasi </h2>
                    <ul>
                        {this.state.presentations.map((val, index) => {
                            return (
                                <li key={index}>{val}</li>
                            )
                        })}
                    </ul>
                    {this.buttonEdit()}
                </div>
            )
        }
    }

    disease(e) {
        this.setState({ disease: e.target.value })
    }

    addArray(data, type) {
        if(type === 'diseases'){
            if(this.state.displaydisease === 'block'){
                this.setState({
                    diseases: [data, ...this.state.diseases],
                    adddisease: '',
                    displaydisease: 'none'
                })
            }else{

                this.setState({displaydisease: 'block'})
            }
        }else if(type === 'tools'){
            if(this.state.displaytool === 'block'){
                this.setState({
                    tools: [data, ...this.state.tools],
                    addtool: '',
                    displaytool: 'none'
                })
            }else{

                this.setState({displaytool: 'block'})
            }
        }else if(type === 'presentations'){
            if(this.state.displaypresentation === 'block'){
                this.setState({
                    presentations: [data, ...this.state.presentations],
                    addpresentation: '',
                    displaypresentation: 'none'
                })
            }else{
                this.setState({displaypresentation: 'block'})
            }
        }
    }

    editArray(e, i, type) {
        if (type === 'diseases') {
            let diseases = this.state.diseases
            diseases[i] = e.target.value
            this.setState({ disaeses: diseases })
        } else if (type === 'tools') {
            let tools = this.state.tools
            tools[i] = e.target.value
            this.setState({ tools: tools })
        } else if (type === 'presentations') {
            let presentations = this.state.presentations
            presentations[i] = e.target.value
            this.setState({ presentations: presentations })
        }
    }

    deleteArray(i, type) {
        if (type === 'diseases') {
            let diseases = this.state.diseases
            diseases.splice(i, 1)
            this.setState({ diseases: diseases })
        } else if (type === 'tools') {
            let tools = this.state.tools
            tools.splice(i,1)
            this.setState({ tools: tools })
        } else if (type === 'presentations') {
            let presentations = this.state.presentations
            presentations.splice(i,1)
            this.setState({ presentations: presentations })
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row hidden-xs topper">
                    <div className="col-xs-7 col-sm-7">
                        <a href="">
                            <img alt="SECUREVIEW" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsNlct_bXo38qv1_zX0oyFe_PJNwC9G9GEuWIWHePxzWFRqGfaTA" className="img-responsive" />
                        </a>
                    </div>
                </div>
                <div className="row">
                    <nav className="navbar navbar-inverse">
                        <div className="container">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <a className="navbar-brand visible-xs-inline-block nav-logo" href="/"><img src="/images/logo-dark-inset.png" className="img-responsive" alt="" /></a>
                            </div>

                            <div className="collapse navbar-collapse navbar-ex1-collapse">
                                <ul className="nav navbar-nav js-nav-add-active-className">
                                    <li className="active"><a>Home</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right hidden-xs">
                                    <Link to="/" type="button" className="navbar-btn btn btn-gradient-red" am-latosans="bold" onClick={this.handleSignout}>Sign Out</Link>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                {this.handleEdit()}
            </div>
        )
    }
}