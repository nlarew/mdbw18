import React from "react";
import styled from "react-emotion";
import { Menu } from "semantic-ui-react";

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 10px;

  display: flex;
  flex-direction: column;
`;

const PageLayout = props => {
  const { isAuthenticated, profile } = props.currentUser;
  return (
    <PageContainer>
      <Menu inverted>
        <Menu.Item header>My Daily Journal</Menu.Item>
        {isAuthenticated && <Menu.Item>Logged in as: {profile.email}</Menu.Item> }
      </Menu>
      {props.children}
    </PageContainer>
  )
}

export default PageLayout
