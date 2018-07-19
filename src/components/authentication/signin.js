import React, { Component } from 'react'
import request from 'superagent'
import * as server from '../../content/url'
import { Redirect } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import './authentication.css'

export default class Signin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            status: false,
            error: '',
            redirect: false,
            type: '',
            id: 0
        }
        this.handleEmail = this.handleEmail.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.login = this.login.bind(this)
        this.handleStateRedirect = this.handleStateRedirect.bind(this)
    }

    handleEmail(e) {
        this.setState({ email: e.target.value })
    }

    handlePassword(e) {
        this.setState({ password: e.target.value })
    }

    login() {
        request
            .post(server.SERVER_URL_USER + "/signin")
            .send({
                email: this.state.email,
                password: this.state.password
            })
            .set('Accept', 'application/json')
            .end((err, val) => {
                if (err) throw err
                var data = JSON.parse(val.text)
                if (data.token && data.token !== null && data.token !== undefined) {
                    localStorage.setItem('token', data.token)
                    jwt.verify(data.token, 'testxcidic', (err, decoded) => {
                        this.setState({
                            status: true,
                            error: data.message,
                            type: decoded.type,
                            id: decoded.id
                        })
                    })
                } else {
                    this.setState({
                        error: data.message,
                        password: ''
                    })
                }
            })
    }

    handleError() {
        if (this.state.status === true) {
            setTimeout(() => {
                this.setState({
                    status: false,
                    error: '',
                    redirect: true
                })
            }, 1000)
            return (
                <div id="signupalert" className="alert alert-success">
                    <p>{this.state.error}</p>
                    <span></span>
                </div>
            )
        } else if (this.state.error !== '') {
            return (
                <div id="signupalert" className="alert alert-danger">
                    <p>Error: {this.state.error}</p>
                    <span></span>
                </div>
            )
        }
    }

    handleStateRedirect(){
        this.setState({ redirect: false })
    }

    render() {
        if (this.state.redirect === true) {
            this.handleStateRedirect()
            if (this.state.type === 'Doctor') {
                return (
                    <Redirect to="/home" />
                )
            } else {
                return (
                    <Redirect to={"/datapatient/" + this.state.id} />
                )
            }
        }
        return (
            <div className="container">
                <div id="loginbox" style={{ marginTop: 50 + "px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <div className="panel panel-info" >
                        <div className="panel-heading">
                            <div className="panel-title">Sign In</div>
                            <div style={{ float: "right", fontSize: 80 + "%", position: "relative", top: -10 + "px" }}><a href="" style={{ cursor: "grab" }}>Forgot password?</a></div>
                        </div>
                        <div style={{ paddingTop: 30 + "px" }} className="panel-body" >
                            {this.handleError()}
                            <form id="loginform" className="form-horizontal">
                                <div style={{ marginBottom: 25 + "px" }} className="input-group">
                                    <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
                                    <input id="login-email" type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleEmail} placeholder="email" />
                                </div>
                                <div style={{ marginBottom: 25 + "px" }} className="input-group">
                                    <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
                                    <input id="login-password" type="password" className="form-control" name="password" value={this.state.password} onChange={this.handlePassword} placeholder="password" />
                                </div>
                                <div className="input-group">
                                    <div className="checkbox">
                                        <label>
                                            <input id="login-remember" type="checkbox" name="remember" value="1" /> Remember me
                                        </label>
                                    </div>
                                </div>
                                <div style={{ marginTop: 10 + "px" }} className="form-group">

                                    <div className="col-sm-12 controls">
                                        <a id="btn-login" onClick={this.login} className="btn btn-success">Login</a>
                                        {/* <a id="btn-fblogin" href="" className="btn btn-primary">Login with Facebook</a> */}

                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-12 control">
                                        <div style={{ borderTop: 1 + "px solid #888", paddingTop: 15 + "px", fontSize: 85 + "%" }} >
                                            Don't have an account!
                                        <a onClick={() => this.props.changeForm('signup')} style={{ cursor: "-webkit-grab" }}>
                                                Sign Up Here
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}