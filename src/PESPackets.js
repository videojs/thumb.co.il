import React, { Component } from 'react';
import Box from 'Box.js';

class PESPackets extends Component {
  render() {
    const packets = this.props.packets.map((packet, index) => {
      return <Box packet={packet} key={index};
    });

    return (
      <div>
        {packets}
      </div>
    );
  }
}

export default PESPackets;
