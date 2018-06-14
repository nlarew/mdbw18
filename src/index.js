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
import Page from "./components/PageLayout";
// MongoDB Stitch
import StitchApp, { StitchContext } from "./stitch";

const LoginRequiredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={() => (
      <StitchContext.Consumer>
        {(stitch) => stitch.currentUser.isAuthenticated
          ? <Component context={stitch} />
          : <Redirect to="/login" />
        }
      </StitchContext.Consumer>
    )}
  />
);

ReactDOM.render(
  <Router>
    <StitchApp appId="mdbw18-mltgy">
      <Page>
        <LoginRequiredRoute path="/" exact component={Journal} />
        <Route path="/login" component={Login} />
      </Page>
    </StitchApp>
  </Router>,
  document.getElementById("root")
);

