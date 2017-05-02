import React, { Component } from 'react';
import DropzoneContainer from './DropzoneContainer';
import './FileLoader.css';

class FileLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      url: 'http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
    };

    this.handleChangeLocal = this.handleChangeLocal.bind(this);
    this.handleChangeRemote = this.handleChangeRemote.bind(this);
    this.handleClickLocal = this.handleClickLocal.bind(this);
    this.handleClickRemote = this.handleClickRemote.bind(this);
  }

  handleChangeLocal(file) {
    this.setState({
      file
    });
  }

  handleChangeRemote(event) {
    this.setState({
      url: event.target.value
    });
  }

  handleClickLocal() {
    if (!this.state.file) {
      // no blob to load
      return;
    }

    let reader = new FileReader();

    reader.addEventListener('loadend', () => {
      this.props.onLoadend({
        data: reader.result,
        name: this.state.file.name
      });
    });

    reader['readAs' + this.responseType(this.state.file.name)](this.state.file);
  }

  responseType(filename) {
    return /\.m3u8/i.test(filename) ? 'Text' : 'ArrayBuffer';
  }

  handleClickRemote() {
    if (!this.state.url) {
      // no url to load
      return;
    }

    let xhr = new XMLHttpRequest();
    let url = this.state.url;

    xhr.responseType = this.responseType(this.state.url).toLowerCase();
    xhr.addEventListener('load', () => {
      this.props.onLoadend({
        data: xhr.response,
        name: url
      });
    });
    xhr.open('GET', url);
    xhr.send();
  }

  render() {
    return (
      <form>
        <fieldset>
          <legend>Load an MP4 or MP2TS:</legend>
          <DropzoneContainer onChange={this.handleChangeLocal} />
          <button type="button" onClick={this.handleClickLocal}>Load File</button>
          <label>
            Remote URL
            <input type="text" value={this.state.url} onChange={this.handleChangeRemote} />
            <button type="button" onClick={this.handleClickRemote}>Load URL</button>
          </label>
        </fieldset>
      </form>
    );
  }
}

export default FileLoader;
