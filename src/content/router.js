import React, { Component } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import Authentication from '../components/authentication'
import history from './history'
import jwt from 'jsonwebtoken'
import Home from '../components/home'
import DataPatient from '../components/data-patient/data-patient'
import Detail from '../components/detail'

let token = localStorage.getItem('token')

if (token) {
    jwt.verify(token, 'testxcidic', (err, decoded) => {
        if (err) {
            localStorage.clear()
            history.replace('/')
        } else {
            if (decoded.type === 'Doctor') {
                history.replace('/home')
            } else if (decoded.type === 'Patient') {
                history.replace(`/datapatient/${decoded.id}`)
            } else {
                history.replace('/')
            }
        }
    })
} else {
    history.replace('/')
}


export default class Routers extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Authentication} />
                    <Route path="/home" component={Home} />
                    <Route path="/datapatient/:id" component={DataPatient} />
                    <Route path="/detail/:id" component={Detail} />
                </Switch>
            </Router>
        )
    }
}