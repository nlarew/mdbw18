import React, { Component } from "react";
import styled, { css } from 'react-emotion';
import Entry, { EntryComposer } from "./Entry";
import { Card } from "semantic-ui-react";

const JournalContainer = styled.div`
  margin: 10px 0 0 0;
  padding: 2px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

class Journal extends Component {
  constructor(props) {
    super(props);
    const {
      stitch: { client, mongodb }
    } = props;

    console.log('p', props)

    this.stitchClient = client;
    this.entries = mongodb.db("journal").collection("entries");
    this.state = {
      entries: []
    };
  }

  async componentDidMount() {
    // TODO: Fetch existing journal entries
    const entries = await this.entries.find({}).execute();
    
    // Add entries to Component State
    this.setState({ entries });
  }

  addEntry = async text => {
    const { currentUser } = this.props.stitch;
    const newEntry = {
      owner_id: currentUser.user_id,
      author: currentUser.data.email,
      date: new Date(),
      body: text,
      sharedWith: []
    };

    try {
      
      // TODO: Add newEntry to MongoDB
      console.log("newEntry", newEntry);
      const result = await this.entries.insertOne(newEntry);
      console.log('result', result)
      newEntry._id = result.insertedId;
      
      // Add newEntry to Component State
      this.setState(({ entries }) => ({
        entries: [...entries, newEntry]
      }));

    } catch (err) {
      console.error(`Error adding entry to journal: ${err}`);
    }
  };

  removeEntry = async entryId => {
    try {
      
      // TODO: Delete the entry from MongoDB
      await this.entries.deleteOne({ _id: entryId });
      
      // Remove Entry from Component State
      this.setState(({ entries }) => ({
        entries: entries.filter(entry => entry._id !== entryId)
      }));

    } catch (err) {
      console.error(`Error removing entry from journal: ${err}`);
    }
  };

  updateEntry = async (entryId, newBody) => {
    try {

      // TODO: Update the Entry body in MongoDB
      await this.entries.updateOne(
        { _id: entryId },
        { $set: { body: newBody } }
      );
      
      // Update the Entry body and disable editing in Component State
      this.setState(({ entries }) => ({
        entries: entries.map(entry => entry._id === entryId
          ? { ...entry, body: newBody, isEditable: false }
          : entry
        )
      }));
        
    } catch (err) {
      console.error(`Error updating entry: ${err}`);
    }
  };

  shareEntry = async (entryId, email) => {
    try {
      
      // TODO: Add the provided email to the Entry sharedWith array in MongoDB
      await this.entries.updateOne(
        { _id: entryId },
        { $push: { sharedWith: email } }
      );

      // Add the provided email to the Entry sharedWith array in Component State
      this.setState(({ entries }) => ({
        entries: entries.map(entry => {
          return entry._id === entryId
            ? { ...entry, sharedWith: [...entry.sharedWith, email] }
            : entry;
        })
      }));
    } catch (err) {
      console.error(`Error sharing entry: ${err}`);
    }
  };

  editEntry = entryId => {
    // Enable Entry editing in Component State
    this.setState(({ entries }) => ({
      entries: entries.map(entry => {
        return entry._id === entryId ? { ...entry, isEditable: true } : entry;
      })
    }));
  };

  cancelEditEntry = entryId => {
    // Discard any text the user entered and disable editing in Component State
    this.setState(({ entries }) => ({
      entries: entries.map(entry => {
        return entry._id === entryId ? { ...entry, isEditable: false } : entry;
      })
    }));
  };

  renderEntries = () => {
    const { removeEntry, updateEntry, shareEntry, editEntry, cancelEditEntry } = this;
    console.log('aaa', this)
    const handlers = { removeEntry, updateEntry, shareEntry, editEntry, cancelEditEntry };
    return this.state.entries.map(entry => (
      <Entry
        key={entry._id}
        entryHandlers={handlers}
        isEditable={false}
        currentUser={this.props.currentUser}
        {...entry}
      />
    ));
  }

  render = () => {
    return (
      <JournalContainer>
        <div className={css`margin-bottom: 20px;`}>
          <EntryComposer addEntry={this.addEntry} />
        </div>
        {this.state.entries.length <= 0 ? <h2>
            No entries.
          </h2> : <Card.Group centered itemsPerRow={1}>
            {this.renderEntries()}
          </Card.Group>}
      </JournalContainer>
    )
  }
}

export default Journal;
