import React, { Component } from 'react';
import thumbcoil from 'thumbcoil';
import './MessageContainer.css';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

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
    const icon =
      type === 'error' ?
        <ErrorIcon color="#f44336" /> :
        type === 'warning' ? <WarningIcon color="#ff9900" /> : null;

    return (
      <div className={className}>
        <ul>
        {messages.map((message) => {
          return <li key={message}>{icon} {message}</li>
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
      <div className="MessageContainer">
      {warningsRender}
      {errorsRender}
      </div>
    );
  }
}

export default MessageContainer;
