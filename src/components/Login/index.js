import React, { Component } from "react";
import styled from "react-emotion";
import { Redirect } from "react-router-dom";
import {
  Segment,
  Form,
  Header,
  Message,
} from "semantic-ui-react";

const LoginPage = styled.div`
  height: 100%;
  
  display: grid;
  grid-template-rows: 50px auto 1fr;
  grid-template-columns: 1fr 500px 1fr;
`

const LoginForm = styled(Segment)`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
`

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: {
        username: "",
        password: ""
      },
      errorMessage: ""
    }
  }

  hackLogin = async () => {
    const { client: stitchClient } = this.props.stitch;
    await stitchClient.authenticate("userpass", { username: "nlarew@gmail.com", password: "nlarew" })
    this.props.setAuth()
  }

  login = async () => {
    const { client: stitchClient } = this.props.stitch;
    const { userInput: { username, password } } = this.state;
    try {
      await stitchClient.authenticate("userpass", {username, password})
      this.props.setAuth()
    } catch(error) {
      console.error(error)
      this.setState({ errorMessage: "Incorrect username or password." })
    }
  }

  handleChange = (e, { name, value }) => {
    return this.setState(prevState => ({
      userInput: { ...prevState.userInput, [name]: value }
    }))
  }

  render = () => {
    const { userInput, errorMessage } = this.state;
    const { isAuthenticated } = this.props.stitch;
    if (isAuthenticated) {
      return <Redirect to="/" />
    }
    // else { this.hackLogin() }
    
    return (
      <LoginPage>
        <LoginForm>
          <Form onSubmit={this.login}>
            <Header as="h1">Log In</Header>
            <Form.Input
              fluid
              label="Username"
              name="username"
              placeholder="someone@example.com"
              defaultValue={userInput.username}
              onChange={this.handleChange}
            />
            <Form.Input
              fluid
              label="Password"
              name="password"
              type="password"
              placeholder="SuperSecretPassword"
              defaultValue={userInput.password}
              onChange={this.handleChange}
            />
            {
              errorMessage && <Message
                negative
                header='Login Failed'
                content={errorMessage}
              />
            }
            <Form.Button type="submit">
              Submit
            </Form.Button>
          </Form>
        </LoginForm>
      </LoginPage>
  )
}

}
