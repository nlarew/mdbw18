import React, { Fragment } from "react";
import styled, { css } from "react-emotion";
import { Menu } from "semantic-ui-react";
import { StitchContext } from "../stitch.js";

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 10px;

  display: flex;
  flex-direction: column;
`;

const PageLayout = props => {
  const {
    logoutCurrentUser,
    currentUser: { isAuthenticated, profile }
  } = props;

  return (
    <PageContainer>
      <Menu inverted>
        <Menu.Item header>My Daily Journal</Menu.Item>
        {isAuthenticated &&
          <Fragment>
            <Menu.Item>Logged in as: {profile.data.email}</Menu.Item>
            <Menu.Item
              name="logout"
              onClick={logoutCurrentUser}
              className={css`margin-left: auto;`}
            />
          </Fragment>
        }
      </Menu>

      {props.children}
    </PageContainer>
  );
};

const Page = (props) => (
  <StitchContext.Consumer>
    { stitch => (
      <PageLayout {...stitch} >
        {props.children}
      </PageLayout>
    )}
  </StitchContext.Consumer>
);

export default Page;
