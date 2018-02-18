import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginUser } from '../actions/login'
import LoginForm from '../components/loginForm'
import { Route, Redirect }from "react-router-dom";
import * as actionCreators from '../actions/login';
import AddBeerButton from '../components/addBeerButton.js'

const listStyle = {
  width: "20%",
  margin: "0 auto"
};

class LoginFormContainer extends Component {

  componentDidMount() {
    const { dispatch, checkLocalToken, isAuthenticated } = this.props
    // if (!isAuthenticated)
    //   checkLocalToken()
  }

  render() {
    const {  loginUser, from, isAuthenticated } = this.props
      return (
        <div>
          <LoginForm from={from} loginUser={loginUser}/>
          <AddBeerButton/>
        </div>
      )
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  email: state.auth.email,
  isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = (dispatch) => (bindActionCreators(actionCreators, dispatch)
)

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormContainer)

