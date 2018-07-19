import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './list-patient.css'

export default class ListPatient extends Component {
    render() {
        return (
            <div>
                <div className="cards-wrapper">
                    <div className="card-wrapper">
                        <div className="card-1 card-object card-object-hf">
                            <Link className="face front" to={'/datapatient/' + this.props.id}>
                                <div className="title-wrapper">
                                    <div className="title">{this.props.name}</div>
                                    <div className="subtitle">{this.props.email}</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}