import React, { Component } from 'react';
import Box from '../Box';

class MediaStats extends Component {
  render() {
    const boxes = this.props.packets.map((packet, index) => {
      return <Box box={packet} key={index} />
    });

    return (
      <div>
        {boxes}
      </div>
    );
  }
}

export default MediaStats;
