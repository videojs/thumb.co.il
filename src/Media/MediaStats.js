import React, { Component } from 'react';
import MessageContainer from './MessageContainer';
import { FrameList, FrameInfo } from './Frame.js';
import ga from 'react-google-analytics';

import './MediaStats.css';

class MediaStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFrame: 0
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(index) {
    const packet = this.props.packets[this.state.currentFrame];

    ga('send', 'event', {
      eventCategory: 'FrameList',
      eventAction: `selected ${packet.type}`
    });

    this.setState({
      currentFrame: index
    });
  }

  render() {
    return (
      <div className="MediaStats">
        <MessageContainer packets={this.props.packets} />
        <div className="FrameStats">
          <FrameList selectFrame={this.handleClick} packets={this.props.packets} currentFrame={this.state.currentFrame} />
          <FrameInfo box={this.props.packets[this.state.currentFrame]} />
        </div>
      </div>
    );
  }
}

export default MediaStats;
