import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import { Card } from "semantic-ui-react";
import Entry from "./Entry";
import Composer from "./Composer";

const JournalContainer = styled.div`
  margin: 10px 0 0 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

class Journal extends Component {
  static propTypes = {
    currentUser: PropTypes.any.isRequired,
    mongodb: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { mongodb } = this.props;

    this.state = {
      entries: []
    };
  }

  

  editEntry = entryId => {
    // Enable Entry editing in Component State
    this.setState(({ entries }) => ({
      entries: entries.map(
        entry =>
          entry._id === entryId ? { ...entry, isEditable: true } : entry
      )
    }));
  };

  cancelEditEntry = entryId => {
    // Discard any text the user entered and disable editing in Component State
    this.setState(({ entries }) => ({
      entries: entries.map(
        entry =>
          entry._id === entryId ? { ...entry, isEditable: false } : entry
      )
    }));
  };

  renderEntries = () => {
    const { currentUser } = this.props;
    const entryHandlers = {
      remove: this.removeEntry,
      update: this.updateEntry,
      share: this.shareEntry,
      unshare: this.unshareEntry,
      edit: this.editEntry,
      cancelEdit: this.cancelEditEntry
    };
    return this.state.entries.map(entry => (
      <Entry
        {...entry}
        entryHandlers={entryHandlers}
        key={entry._id}
        isEditable={entry.isEditable}
        currentUserIsAuthor={entry.author === currentUser.profile.data.email}
      />
    ));
  };

  render() {
    return (
      <JournalContainer>
        <Composer submitHandler={this.addEntry} />
        {this.state.entries.length <= 0 ? (
          <h2>No entries.</h2>
        ) : (
          <Card.Group centered itemsPerRow={1}>
            {this.renderEntries()}
          </Card.Group>
        )}
      </JournalContainer>
    );
  }
}

export default Journal;
