import React, { Component } from 'react';
import FileLoader from './FileLoader/FileLoader';
import MediaContainer from './MediaContainer';
import ManifestContainer from './Manifest/ManifestContainer';
import Load from './LoaderUtils'
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

    this.requestLoad = this.requestLoad.bind(this);
    this.selectMedia = this.selectMedia.bind(this);
  }

  requestLoad(requestInfo) {
    const location = requestInfo.location;
    const reset = requestInfo.reset;

    Load[location](requestInfo.options, (...args) => {
      if (reset) {
        this.setState(initialState());
      }

      this[location + 'Loadend'](...args);
    });
  }

  localLoadend(data) {
    if (/\.m3u8/i.test(data.name)) {
      this.loadedManifest(data);
    } else if(/\.ts/i.test(data.name)){
      this.loadedTS(data);
    }
  }

  remoteLoadend(error, response) {
    const data = {
      name: response.url,
      data: response.body
    };

    this.localLoadend(data);
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

  selectMedia(media) {
    debugger;
    const requestInfo = {
      options: {
        url: media.resolvedUri,
        headers: media.xhrHeaders
      },
      location: 'remote',
      reset: false
    };

    this.requestLoad(requestInfo);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Thumbcoil</h2>
        </div>
        <FileLoader requestLoad={ this.requestLoad } />
        {this.state.manifest && (<ManifestContainer manifest={this.state.manifest} selectMedia={this.selectMedia} />) }
        <MediaContainer name={this.state.media.name} bytes={this.state.media.bytes} />
      </div>
    );
  }
}

export default App;
