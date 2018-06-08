import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
// import App from './App';
import Journal from "./components/Journal";
import Login from "./components/Login";

import { StitchClientFactory } from "mongodb-stitch";
import initializeAppClient, { StitchContext } from "./stitch";

import PageLayout from "./components/PageLayout";

// const CurrentUserContext = React.createContext({ isAuthenticated: false, profile: null });
// export { CurrentUserContext }

class App extends Component {
  constructor(props) {
    super(props);
    console.log("asdf", props);
    this.state = { stitch: props.stitch };
  }

  setAuthenticationState = async () => {
    const {
      stitch: { client: stitchClient }
    } = this.state;
    const isAuthenticated = stitchClient.isAuthenticated();
    const profile = isAuthenticated ? await stitchClient.userProfile() : null;
    const currentUser = { isAuthenticated, profile };

    this.setState(prevState => ({
      ...prevState,
      stitch: { ...prevState.stitch, currentUser }
    }));
  };

  render = () => {
    const { currentUser } = this.state.stitch;

    return (
      <PageLayout {...currentUser}>
        <Router>
          <Fragment>
            <Route path="/" exact render={() => isAuthenticated
                ? <Journal />
                : <Redirect to="/login" />
              }/>
            <Route
              path="/login"
              render={() => (
                <Login
                  stitch={{ ...this.state.stitch }}
                  setAuth={this.setAuthenticationState}
                />
              )}
            />
          </Fragment>
        </Router>
      </PageLayout>
    );
  };
}

// async function initializeStitchclient(appId) {
//   const stitchClient = await StitchClientFactory.create(appId);
//   return {
//     stitch: {
//       client: stitchClient,
//       mongodb: stitchClient.service("mongodb", "mongodb-atlas"),
//       currentUser: { isAuthenticated: false, profile: null }
//     }
//   };
// }

// initializeStitchclient("mdbw18-mltgy").then(stitchProps => {
//   render(<App {...stitchProps} />, document.getElementById("root"));
// });

initializeAppClient("mdbw18-mltgy").then(stitch => {
  const { Provider } = StitchContext;

  render(
    <Provider value={stitch}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
});
