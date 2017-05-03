import React, { Component } from 'react';
import thumbcoil from 'thumbcoil';
import Box from './Box';

class MediaContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parsed: this.parse(this.props.name, this.props.bytes)
    };
  }

  parse(name, bytes) {
    if (!bytes) {
      return null;
    }

    if (!(/\.ts/i.test(name))) {
      // only parse ts segments for now
      return null;
    }

    return thumbcoil.tsInspector.inspect(bytes);
  }

  render() {
    if (!this.state.parsed) {
      return null;
    }

    const boxes = this.state.parsed.esMap.map((packet, index) => {
      return <Box box={packet} key={index} />
    });

    return (
      <div>
        {boxes}
      </div>
    );
  }
}

export default MediaContainer;
