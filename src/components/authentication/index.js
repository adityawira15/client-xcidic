import React, { Component } from 'react';
import Signin from './signin'
import Signup from './signup'

export default class Authentication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: 'signin'
    }
    this.handleForm = this.handleForm.bind(this)
  }

  handleForm(form){
    this.setState({form: form})
  }

  render() {
    if (this.state.form === 'signin') {
      return (
        <div>
          <Signin changeForm={this.handleForm} />
        </div>
      );
    } else if(this.state.form === 'signup') {
      return (
        <div>
          <Signup changeForm={this.handleForm} />
        </div>
      )
    }
  }
}

