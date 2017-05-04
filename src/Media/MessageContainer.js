import React, { Component } from 'react';
import thumbcoil from 'thumbcoil';
import './MessageContainer.css';

class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validationResults: thumbcoil.validateContainers(this.props.packets)
    };
  }

  messageList(messages, type) {
    if (messages.length === 0) {
      return null;
    }

    const className = `message-container-${type}`;

    return (
      <div className={className}>
        <ul>
        {messages.map((message) => {
          return <li key={message}>{message}</li>
        })}
        </ul>
      </div>
    );
  }

  render() {
    if (!this.state.validationResults) {
      return null;
    }

    if (this.state.validationResults.warnings === 0 &&
        this.state.validationResults.errors === 0) {
      return null;
    }

    const warningsRender =
      this.messageList(this.state.validationResults.warnings, 'warning');
    const errorsRender =
      this.messageList(this.state.validationResults.errors, 'error');

    return (
      <div>
      {warningsRender}
      {errorsRender}
      </div>
    );
  }
}

export default MessageContainer;
