import React, { Component, Fragment } from "react";
import styled from "react-emotion";
import moment from "moment";
import {
  Card,
  Button,
  Modal,
  List,
  Header,
  Form
} from "semantic-ui-react";

const EntryCard = styled(Card)`
  margin: 10px 0;
  width: 700px;

  & h4 {
    line-height: 30px;
    padding: 10px 10px 0 10px;
    margin: 0 auto 0 0;
  }
  & h5 {
    line-height: 30px;
    padding: 0 10px 10px 10px;
  }
`;

const LiteralText = styled(Card.Description)`
  white-space: pre-wrap;
`;

class ShareSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      shareWithEmail: ""
    };
  }

  render() {
    return (
      <Modal
        trigger={
          <Button onClick={() => this.setState({ open: true })}>{this.props.buttonTitle}</Button>
        }
        onClose={() => this.setState({ open: false })}
        open={this.state.open}
      >
        <Modal.Header>Share this Journal Entry</Modal.Header>
        <Modal.Content>
          <Header>People who can read this entry:</Header>
          <List bulleted>
            {this.props.sharedWith.map(email => (
              <List.Item key={email}>{email}</List.Item>
            ))}
          </List>

          <Form
            onSubmit={() =>
              this.props.shareEntry(this.props.id, this.state.shareWithEmail)
            }
          >
            <Form.Input
              fluid
              name="shareWithEmail"
              action="Share"
              placeholder="someone@example.com"
              onChange={(e, { name, value }) =>
                this.setState({ [name]: value })
              }
            />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

class Entry extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newBody: false
    }
  }

  render() {
    let {
      _id,
      date,
      body,
      author,
      sharedWith,
      isEditable,
      currentUser,
      entryHandlers: { shareEntry, updateEntry, removeEntry, editEntry, cancelEditEntry }
    } = this.props;

    return (
      <EntryCard>
        <Card.Header>
          <h4>{moment(date).format("dddd, MMMM Do YYYY")}</h4>
        </Card.Header>
        <Card.Meta>
          <h5>Written by: {author}</h5>
        </Card.Meta>

        <Card.Content>
          {
            isEditable
              ? <Form onSubmit={() => {
                  const { newBody } = this.state;
                  updateEntry(_id, newBody ? newBody : body)}
                }>
                  <Form.TextArea
                    autoHeight
                    name="newBody"
                    onChange={(e, { name, value }) =>
                      this.setState({ [name]: value })
                    }
                    placeholder="What's on your mind?"
                    rows={2}
                    defaultValue={body}
                  />
                    { currentUser.profile.email === author && (
                        <Form.Group>
                          <Form.Button positive action="submit">Update</Form.Button>
                          <Form.Button onClick={() => cancelEditEntry(_id)}>Cancel</Form.Button>
                        </Form.Group>
                    )}
                </Form>
              : <LiteralText>{body}</LiteralText>
          }
        </Card.Content>

        <Card.Content extra>
          <Fragment>
            <ShareSheet
              id={_id}
              buttonTitle="Share"
              shareEntry={shareEntry}
              sharedWith={sharedWith}
            />
            <Button onClick={() => editEntry(_id)}>Update</Button>
            <Button onClick={() => removeEntry(_id)}>Remove</Button>
          </Fragment>
        </Card.Content>
      </EntryCard>
    );
  }
}

export default Entry;

export class EntryComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      shareWithEmail: ""
    };
  }

  render() {
    return (
      <Modal
        trigger={
          <Button primary onClick={() => this.setState({ open: true })}>Add Entry</Button>
        }
        onClose={() => this.setState({ open: false })}
        open={this.state.open}
      >
        <Modal.Header>Write a New Journal Entry</Modal.Header>
        <Modal.Content>
          <Form
            onSubmit={() => {
              this.props.addEntry(this.state.entryBody)
              this.setState({ open: false })
            }}
          >
            <Form.TextArea
              name="entryBody"
              placeholder="What's on your mind..."
              onChange={(e, { name, value }) =>
                this.setState({ [name]: value })
              }
            />
            <Form.Group>
              <Form.Button positive action="submit">Submit</Form.Button>
              <Form.Button onClick={() => this.setState({ open: false })}>Cancel</Form.Button>
            </Form.Group>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
