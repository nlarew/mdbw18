import React, { createContext } from 'react';
import PropTypes from "prop-types";
import { StitchClientFactory } from 'mongodb-stitch';

const StitchContext = createContext({
  stitchClient: {},
  mongodb: {},
  currentUser: { isAuthenticated: false, profile: { email: "" } }
});

const withStitch = (Component) => (
  <StitchContext.Consumer>
    {stitch => <Component context={stitch} />}
  </StitchContext.Consumer>
);

export { StitchContext, withStitch };

export default class StitchApp extends React.Component {
  constructor(props) {
    super(props);
    this.appId = props.appId;
    this.state = {
      stitchClient: {},
      mongodb: {},
      currentUser: { isAuthenticated: false, profile: {} }
    };
  }

  componentDidMount() {
    this.initializeAppClient(this.appId);
  }

  initializeAppClient = async (appId) => {
    // Create a Stitch client object
    const stitchClient = await StitchClientFactory.create(appId);
    await stitchClient.logout();
    // Instantiate the MongoDB Service
    const mongodb = stitchClient.service("mongodb", "mongodb-atlas");
    // Stub out an object for the current user's profile information
    const isAuthenticated = stitchClient.isAuthenticated();
    const profile = isAuthenticated ? await stitchClient.userProfile() : {};
    const currentUser = { isAuthenticated, profile };

    this.setState({ stitchClient, mongodb, currentUser });
  };

  authenticateUser = async (username, password) => {
    const { stitchClient } = this.state;
    try {
      await stitchClient.authenticate("userpass", { username, password });
      const profile = await stitchClient.userProfile();
      
      this.setState(({ currentUser }) => ({
        currentUser: { ...currentUser, profile, isAuthenticated: true }
      }));
    } catch (error) {
      this.setState({ errorMessage: "Incorrect username or password." });
    }
  };

  logoutCurrentUser = async () => {
    const { stitchClient } = this.state;
    await stitchClient.logout();
    this.setState(() => ({ currentUser: { profile: {}, isAuthenticated: false } }));
  };

  render() {
    const providerData = {
      ...this.state,
      authenticateUser: this.authenticateUser,
      logoutCurrentUser: this.logoutCurrentUser,
    };
    return(
      <StitchContext.Provider value={providerData}>
        {this.props.children}
      </StitchContext.Provider>
    );
  }
}

StitchApp.propTypes = {
  appId: PropTypes.string.isRequired,
};
