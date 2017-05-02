import React, { Component } from 'react';
import thumbcoil from 'thumbcoil';
import Box from './Box';

class MediaContainer extends Component {
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
    const parsed = this.parse(this.props.name, this.props.bytes);

    if (!parsed) {
      return null;
    }

    const boxes = parsed.esMap.map((packet, index) => {
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
