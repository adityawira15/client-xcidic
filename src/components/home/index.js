import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import request from 'superagent'
import * as server from '../../content/url'
import jwt from 'jsonwebtoken'
import Add from '../add'
import ListPatient from '../list/list-patient'
import './home.css'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signout: false,
            display: 'none',
            message: '',
            data: []
        }
        this.handleSignout = this.handleSignout.bind(this)
        this.handleDisplay = this.handleDisplay.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
        this.alerts = this.alerts.bind(this)
    }

    componentWillMount(){
        request
        .get(server.SERVER_URL + '/patient')
        .set('Accept', 'application/json')
        .end((err, response) => {
            if (err) throw err
            let data = JSON.parse(response.text)
            this.setState({data: data})
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

    handleDisplay() {
        if (this.state.display === 'block') {
            this.setState({ display: 'none' })
        } else if (this.state.display === 'none') {
            this.setState({ display: 'block' })
        }
    }

    handleMessage(message) {
        this.setState({ message: message })
        setTimeout(() => {
            this.setState({ message: '' })
        }, 2000)
    }

    alerts() {
        if (this.state.message !== '') {
            return (
                <p className="bg-success alert">{this.state.message}</p>
            )
        }
    }

    render() {
        return (
            <div>
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
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                        <button type="button" onClick={this.handleDisplay} className="btn button"><span className="glyphicon glyphicon-plus" aria-hidden="true" /> Add</button>
                    </div>
                    {this.alerts()}
                    <Add handleDisplay={this.handleDisplay} handleMessage={this.handleMessage} display={this.state.display} />
                    {this.state.data.map((val, index) => {
                        return(
                            <ListPatient key={index} id={val.id} name={val.fullname} email={val.email} />
                        )
                    })}
                </div>
            </div>
        )
    }
}
