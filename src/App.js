import React, { Component } from 'react';
import FileLoader from './FileLoader/FileLoader';
import MediaContainer from './MediaContainer';
import ManifestContainer from './Manifest/ManifestContainer';
import logo from './thumbcoil_logo.svg';
import './App.css';

const initialState = function() {
  return {
    media: {
      bytes: null,
      name: ''
    },
    manifest: null
  };
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState();

    this.onLoadend = this.onLoadend.bind(this);
  }

  onLoadend(data) {
    // Clear the state on new loads
    this.setState(initialState());

    if (/\.m3u8/i.test(data.name)) {
      this.loadedManifest(data);
    } else if(/\.ts/i.test(data.name)){
      this.loadedTS(data);
    }
  }

  loadedManifest(data) {
    this.setState({
      manifest: {
        uri: data.name,
        text: data.data
      }
    });
  }

  loadedTS(data) {
    this.setState({
      media: {
        bytes: new Uint8Array(data.data),
        name: data.name
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Thumbcoil</h2>
        </div>
        <FileLoader onLoadend={ this.onLoadend } />
        {this.state.manifest && (<ManifestContainer manifest={this.state.manifest} />) }
        <MediaContainer name={this.state.media.name} bytes={this.state.media.bytes} />
      </div>
    );
  }
}

export default App;
