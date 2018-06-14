import React, { Component } from "react";
import styled from "react-emotion";
import { Redirect } from "react-router-dom";
import { StitchContext } from "../../stitch.js";
import {
  Segment,
  Form,
  Header,
  Message,
  Button,
} from "semantic-ui-react";

const LoginContainer = styled.div`
  height: 100%;
  
  display: grid;
  grid-template-rows: 50px auto 1fr;
  grid-template-columns: 1fr 500px 1fr;
`;

const LoginForm = styled(Segment)`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
`;



class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: {
        username: "",
        password: ""
      },
      errorMessage: ""
    };
  }

  handleChange = (e, { name, value }) => {
    return this.setState(prevState => ({
      userInput: { ...prevState.userInput, [name]: value }
    }));
  };

  render = () => {
    const {
      errorMessage,
      userInput: { username, password },
    } = this.state;
    
    const {
      authenticateUser,
      currentUser: { isAuthenticated }
    } = this.props.context;
    
    if (isAuthenticated) {
      return <Redirect to="/" />;
    }
    
    return (
      <LoginContainer>
        <LoginForm>
          <Button onClick={() => authenticateUser("nlarew@gmail.com", "nlarew")}>nlarew</Button>
          <Button onClick={() => authenticateUser("someotheruser@example.com", "password")}>some other user</Button>
          <Form onSubmit={() => { authenticateUser(username, password); }}>
            <Header as="h1">Log In</Header>
            <Form.Input
              fluid
              label="Username"
              name="username"
              placeholder="someone@example.com"
              defaultValue={username}
              onChange={this.handleChange}
            />
            <Form.Input
              fluid
              label="Password"
              name="password"
              type="password"
              placeholder="SuperSecretPassword"
              defaultValue={password}
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
      </LoginContainer>
    );
  };

}

const Login = () => (
  <div>
    <StitchContext.Consumer>
      {stitch => <LoginPage context={stitch} />}
    </StitchContext.Consumer>
  </div>
);
export default Login;
