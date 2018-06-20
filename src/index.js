// Styles
import "./index.css";
import "semantic-ui-css/semantic.min.css";
// React
import React from "react";
import ReactDOM from "react-dom";
// App Components
import Page from "./components/Page";
import Login from "./components/Login";
import Journal from "./components/Journal";
// MongoDB Stitch
import {
  Stitch,
  UserPasswordCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

const APP_ID = "mdbw18-mltgy";

class StitchApp extends React.Component {
  constructor(props) {
    super(props);
    this.appId = props.appId;
    this.client = Stitch.initializeDefaultAppClient(this.appId);
    this.mongodb = this.client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
    
    const isAuthed = this.client.auth.isLoggedIn;
    this.state = { isAuthed };
  }

  login = async (email, password) => {
    const { isAuthed } = this.state;
    if (isAuthed) {
      return;
    }

    const credential = new UserPasswordCredential(email, password);
    await this.client.auth.loginWithCredential(credential);
    this.setState({ isAuthed: true });
  };

  logout = async () => {
    this.client.auth.logout();
    this.setState({ isAuthed: false });
  };

  render() {
    const { isAuthed } = this.state;
    const currentUser = isAuthed && this.client.auth.currentUser;
    
    return (
      <Page
        currentUser={currentUser}
        logoutCurrentUser={this.logout}
      >{
        isAuthed ? (
          <Journal
            mongodb={this.mongodb}
            currentUser={currentUser}
          />
        ) : (
          <Login authenticateUser={this.login} />
        )
      }
      </Page>
    );
  }
}

ReactDOM.render(
  <StitchApp appId="mdbw18-mltgy" />,
  document.getElementById("root")
);
