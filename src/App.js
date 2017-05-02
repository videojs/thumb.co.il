import React, { Component } from 'react';
import FileLoader from './FileLoader/FileLoader';
import ParseView from './ParseView';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      bytes: null,
      name: ''
    };

    this.onLoadend = this.onLoadend.bind(this);
  }

  onLoadend(data) {
    this.setState(data);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <FileLoader onLoadend={ this.onLoadend } />
        <ParseView name={this.state.name} bytes={this.state.bytes} />
      </div>
    );
  }
}

export default App;
