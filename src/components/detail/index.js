import React, { Component } from 'react'
import jwt from 'jsonwebtoken'
import request from 'superagent'
import * as server from '../../content/url'
import { Link } from 'react-router-dom'

export default class Detail extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            email: '',
            disease: '',
            diseases: [],
            tools: [],
            presentations: []
        }
        this.handleSignout = this.handleSignout.bind(this)
    }

    componentWillMount(){
        request
            .get(server.SERVER_URL + '/detail/' + this.props.match.params.id)
            .set('Accept' , 'application/json')
            .end((err, response) => {
                if(err) throw err
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
                <div className="jumbotron">
                    <h2><b>Diagnostic</b></h2>
                    <p>{this.state.disease}</p>
                    <h3> <b> kemungkinan penyakit lainnya</b> </h3>
                    <ul>
                        {this.state.diseases.map((val, index) => {
                            return(
                                <li key={index}>{val}</li>
                            )
                        })}
                    </ul>
                    <p><b>Tests: </b>{this.state.tools.join(', ')}</p>
                    <h2> presentasi </h2>
                    <ul>
                        {this.state.presentations.map((val, index) => {
                            return(
                                <li key={index}>{val}</li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}