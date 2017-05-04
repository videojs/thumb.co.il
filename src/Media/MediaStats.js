import React, { Component } from 'react';
import Box from '../Box';
import MessageContainer from './MessageContainer';

class MediaStats extends Component {
  render() {
    const boxes = this.props.packets.map((packet, index) => {
      return <Box box={packet} key={index} />
    });

    return (
      <div>
        <MessageContainer packets={this.props.packets} />
        {boxes}
      </div>
    );
  }
}

export default MediaStats;
