import React, { Component } from 'react'
import request from 'superagent'
import * as server from '../../content/url'
import { Redirect } from 'react-router-dom'

export default class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            repassword: '',
            type: 'Doctor',
            error: '',
            status: false,
            redirect: false
        }

        this.firstname = this.firstname.bind(this)
        this.lastname = this.lastname.bind(this)
        this.email = this.email.bind(this)
        this.password = this.password.bind(this)
        this.rePassword = this.rePassword.bind(this)
        this.type = this.type.bind(this)
        this.handleSignup = this.handleSignup.bind(this)
    }

    firstname(e) {
        this.setState({ firstname: e.target.value })
    }

    lastname(e) {
        this.setState({ lastname: e.target.value })
    }

    email(e) {
        this.setState({ email: e.target.value })
    }

    password(e) {
        this.setState({ password: e.target.value })
    }

    rePassword(e) {
        this.setState({ repassword: e.target.value })
    }

    type(e) {
        this.setState({ type: e.target.value })
    }

    handleSignup() {
        if (this.state.password === this.state.repassword) {
            request
                .post(server.SERVER_URL_USER + '/signup')
                .send({
                    firstname: this.state.firstname,
                    lastname: this.state.lastname,
                    email: this.state.email,
                    password: this.state.password,
                    type: this.state.type
                })
                .set('Accept', 'application/json')
                .end((err, response) => {
                    if (err) throw err
                    var data = JSON.parse(response.text)
                    if (data.token !== null && data.token && data.token !== undefined) {
                        this.setState({
                            firstname: '',
                            lastname: '',
                            email: '',
                            password: '',
                            repassword: '',
                            type: 'Doctor',
                            error: data.message,
                            status: true
                        })
                        localStorage.setItem('token', data.token)
                    } else {
                        this.setState({
                            password: '',
                            repassword: '',
                            error: data.message
                        })
                    }
                })
        } else {
            this.setState({
                password: '',
                repassword: '',
                error: 'Password Not Same!'
            })
        }
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
                    <p>Success: {this.state.error}</p>
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

    render() {
        if(this.state.redirect){
            
            this.setState({redirect: false})
            return(
                <Redirect to="/home" />
            )
        }
        return (
            <div className="container">
                <div id="signupbox" style={{ marginTop: 50 + "px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            <div className="panel-title">Sign Up</div>
                            <div style={{ float: "right", fontSize: 85 + "%", position: "relative", top: -10 + "px", cursor: "-webkit-grab" }}><a id="signinlink" onClick={() => this.props.changeForm('signin')}>Sign In</a></div>
                        </div>
                        <div className="panel-body" >
                            <form id="signupform" className="form-horizontal">
                                {this.handleError()}
                                <div className="form-group">
                                    <label htmlFor="firstname" className="col-md-3 control-label">First Name</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" name="firstname" onChange={this.firstname} value={this.state.firstname} placeholder="First Name" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname" className="col-md-3 control-label">Last Name</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" name="lastname" onChange={this.lastname} value={this.state.lastname} placeholder="Last Name" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="col-md-3 control-label">Email</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" name="email" onChange={this.email} value={this.state.email} placeholder="Email Address" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="col-md-3 control-label">Password</label>
                                    <div className="col-md-9">
                                        <input type="password" className="form-control" name="passwd" onChange={this.password} value={this.state.password} placeholder="Password" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="repassword" className="col-md-3 control-label">Re-Password</label>
                                    <div className="col-md-9">
                                        <input type="password" className="form-control" name="repassword" onChange={this.rePassword} value={this.state.repassword} placeholder="Retype Password" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type" className="col-md-3 control-label">Type</label>
                                    <div className="col-md-9" name="type">
                                        <div className="radio">
                                            <label><input type="radio" value="Doctor" onChange={this.type} name="optradio" checked />Doctor</label>
                                        </div>
                                        <div className="radio">
                                            <label><input type="radio" value="Patient" onChange={this.type} name="optradio" />Patient</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-offset-3 col-md-9">
                                        <button id="btn-signup" type="button" onClick={this.handleSignup} className="btn btn-info"><i className="icon-hand-right"></i> Sign Up</button>
                                        {/* <span style={{ marginLeft: 8 + "px" }}>or</span> */}
                                    </div>
                                </div>
                                {/* <div style={{ borderTop: 1 + "px solid #999", paddingTop: 20 + "px" }} className="form-group">
                                    <div className="col-md-offset-3 col-md-9">
                                        <button id="btn-fbsignup" type="button" className="btn btn-primary"><i className="icon-facebook"></i>   Sign Up with Facebook</button>
                                    </div>
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}