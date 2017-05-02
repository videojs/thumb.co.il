import React, { Component } from 'react';
import FileLoader from './FileLoader/FileLoader';
import ParseView from './ParseView';
import m3u8 from 'm3u8-parser';
import logo from './thumbcoil_logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      media: {
        bytes: null,
        name: ''
      },
      manifest: null
    };

    this.onLoadend = this.onLoadend.bind(this);
  }

  onLoadend(data) {
    if (/\.m3u8/i.test(data.name)) {
      this.loadedManifest(data);
    } else if(/\.ts/i.test(data.name)){
      this.loadedTS(data);
    }
  }

  loadedManifest(data) {

  }

  loadedTS(data) {
    this.setState({
      media: {
        bytes: data.bytes,
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
        <ParseView name={this.state.media.name} bytes={this.state.media.bytes} />
      </div>
    );
  }
}

export default App;
