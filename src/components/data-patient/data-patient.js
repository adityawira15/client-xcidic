import React, { Component } from 'react'
import jwt from 'jsonwebtoken'
import request from 'superagent'
import * as server from '../../content/url'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './data-patient.css'

export default class DataPatient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alertcolor: [
                {
                    color: '#0e4603',
                    background: 'alert-success',
                    button: 'btn-success'
                },
                {
                    color: '#070346',
                    background: 'alert-info',
                    button: 'btn-primary'
                },
                {
                    color: '#424603',
                    background: 'alert-warning',
                    button: 'btn-warning'
                },
                {
                    color: '#460303',
                    background: 'alert-danger',
                    button: 'btn-danger'
                }
            ],
            data: [],
            message: '',
            display: 'none'
        }
        this.handleSignout = this.handleSignout.bind(this)
        this.deleteDiagnosis = this.deleteDiagnosis.bind(this)
        this.setMessage = this.setMessage.bind(this)
    }

    componentWillMount() {
        request
            .get(server.SERVER_URL + '/datapatient/' + this.props.match.params.id)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) throw err
                let data = JSON.parse(response.text)
                this.setState({ data: data })
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

    deleteDiagnosis(id) {
        request
            .delete(server.SERVER_URL + '/deletedata/' + id)
            .set('Accept', 'application/json')
            .end((err, response) => {
                let data = JSON.parse(response.text)
                if (err) throw err
                let index = this.state.data.findIndex(o => o.id === id)
                let array = this.state.data
                if (index >= 0) {
                    delete array[index]
                    this.setState({
                        message: data.message,
                        data: array,
                        display: 'block'
                    })
                }
            })
    }

    handleList() {
        let token = localStorage.getItem('token')
        let data = jwt.verify(token, 'testxcidic')
        if (this.state.data.length === 0) {
            return (
                <div className="container" style={{ textAlign: 'center', padding: "100px 0" }}>
                    <h1 style={{ opacity: 0.5 }}>Not Found!</h1>
                </div>
            )
        } else {
            return (
                <div>
                    {this.state.data.map((val, index) => {
                        let random = Math.floor(Math.random() * 4)
                        if (data.type === 'Doctor') {
                            return (
                                <li key={index} style={{
                                    listStyleType: "none",
                                    paddingLeft: 0,
                                    marginLeft: 0
                                }}>
                                    <div className={"alert " + this.state.alertcolor[random].background} id="alerthtml" style={{ textAlign: "left", marginLeft: 0, color: this.state.alertcolor[random].color, marginRight: 30 + '%' }}>
                                        <label htmlFor="alerthtml" >
                                            <button type="button" title="Delete Diagnosis!" className={"btn " + this.state.alertcolor[random].button} onClick={() => this.deleteDiagnosis(val.id)} style={{ padding: "0 7px", borderRadius: 100 + '%', marginRight: "2em" }}>-</button>
                                        </label>
                                        <Link to={"/detail/" + val.id} className={"btn btn-xs pull-right " + this.state.alertcolor[random].button}>Learn More</Link>
                                        <strong>Diagnostic: </strong>{moment(val.date).format('DD MMMM YYYY')}
                                    </div>
                                </li>
                            )
                        } else {
                            return (
                                <li key={index} style={{
                                    listStyleType: "none",
                                    paddingLeft: 0,
                                    marginLeft: 0
                                }}>
                                    <div className={"alert " + this.state.alertcolor[random].background} id="alerthtml" style={{ textAlign: "left", marginLeft: 0, color: this.state.alertcolor[random].color, marginRight: 30 + '%' }}>
                                        <Link to={"/detail/" + val.id} className={"btn btn-xs pull-right " + this.state.alertcolor[random].button}>Learn More</Link>
                                        <strong>Diagnostic: </strong>{moment(val.date).format('DD MMMM YYYY')}
                                    </div>
                                </li>
                            )
                        }

                    })}
                </div>
            )
        }
    }

    setMessage() {
        setTimeout(() => {
            this.setState({
                message: '',
                display: 'none'
            })

        }, 5000)
    }

    render() {
        if (this.state.message !== '') {
            this.setMessage()
        }
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
                <p className="alert alert-danger" style={{ display: this.state.display, color: this.state.alertcolor[3].color }}>{this.state.message}</p>
                <div className="container">
                    <ul stye={{ listStyleType: "none" }}>
                        {this.handleList()}
                    </ul>
                </div>
            </div>
        )
    }
}