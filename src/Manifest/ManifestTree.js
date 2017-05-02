import React, { Component } from 'react';

class ManifestTree extends Component {
  render() {
    const style = {
      textAlign: 'left'
    };

    return (
      <div style={style}>
        <pre>{JSON.stringify(this.props.master, null, '  ')}</pre>
      </div>
    );
  }
}

export default ManifestTree;
