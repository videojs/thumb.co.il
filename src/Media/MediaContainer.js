import React, { Component } from 'react';
import thumbcoil from 'thumbcoil';
import MediaStats from './MediaStats';
import GopView from '../GopView';

class MediaContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parsed: this.parse(this.props.name, this.props.bytes),
      activeView: 1
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

    return (
      <div>
        {this.state.activeView === 0 && <MediaStats packets={this.state.parsed.esMap} />}
        {this.state.activeView === 1 && <GopView name={this.props.name} packets={this.state.parsed.esMap} />}
      </div>
    );
  }
}

export default MediaContainer;
