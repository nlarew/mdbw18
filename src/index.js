// Styles
import "./index.css";
import "semantic-ui-css/semantic.min.css";
// React
import React from "react";
import ReactDOM from "react-dom";
// Component Imports
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Journal from "./components/Journal";
import Login from "./components/Login";
import Page from "./components/Page";
// MongoDB Stitch
import StitchApp from "./stitch";

const AppRouter = stitch => {
  const {
    stitchClient,
    isAuthenticated,
    currentUser,
    authenticateUser,
    logoutCurrentUser
  } = stitch;

  const pageProps = { currentUser, logoutCurrentUser };
  const journalProps = { stitchClient, currentUser };
  const loginProps = { isAuthenticated, authenticateUser };

  return (
    <Router>
      <Page {...pageProps}>

        <Route
          path="/login"
          render={() => <Login {...loginProps} />}
        />

        <Route
          exact path="/"
          render={() => {
            if (!isAuthenticated) {
              return <Redirect to="/login" />;
            }
            return <Journal {...journalProps} />;
          }}
        />

      </Page>
    </Router>
  );
};

ReactDOM.render(
  <StitchApp
    appId="mdbw18-mltgy"
    render={AppRouter}
  />,
  document.getElementById("root")
);

