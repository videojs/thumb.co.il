import React, { Component } from 'react';
import './FileLoader.css';

class FileLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      blob: null,
      url: 'https://hslsslak-a.akamaihd.net/3303963094001/5147667971001/3303963094001_5147667971001_5147609827001-1.ts'
    };

    this.handleChangeLocal = this.handleChangeLocal.bind(this);
    this.handleChangeRemote = this.handleChangeRemote.bind(this);
    this.handleClickLocal = this.handleClickLocal.bind(this);
    this.handleClickRemote = this.handleClickRemote.bind(this);
  }

  handleChangeLocal(event) {
    this.setState({
      value: event.target.value,
      blob: event.target.files[0]
    });
  }

  handleChangeRemote(event) {
    this.setState({
      url: event.target.value
    });
  }

  handleClickLocal() {
    if (!this.state.blob) {
      // no blob to load
      return;
    }

    let reader = new FileReader();

    reader.addEventListener('loadend', () => {
      this.props.onLoadend({
        bytes: new Uint8Array(reader.result),
        name: this.state.value
      });
    });

    reader.readAsArrayBuffer(this.state.blob);
  }

  handleClickRemote() {
    if (!this.state.url) {
      // no url to load
      return;
    }

    let xhr = new XMLHttpRequest();
    let url = this.state.url;

    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', () => {
      this.props.onLoadend({
        bytes: new Uint8Array(xhr.response),
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
          <label>
            Local File
            <input type="file" value={this.state.value} onChange={this.handleChangeLocal} />
            <button type="button" onClick={this.handleClickLocal}>Load File</button>
          </label>
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
