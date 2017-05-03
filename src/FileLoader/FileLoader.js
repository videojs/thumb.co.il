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

    const requestInfo = {
      options: this.state.file,
      reset: true,
      location: 'local'
    };

    this.props.requestLoad(requestInfo);
  }

  handleClickRemote() {
    if (!this.state.url) {
      // no url to load
      return;
    }

    const requestInfo = {
      options: {
        url: this.state.url
      },
      reset: true,
      location: 'remote'
    };

    this.props.requestLoad(requestInfo);
  }

  render() {
    return (
      <div className="FileLoader">
        <form>
          <div className="FileLoader-options">
            <div className="FileLoader-remote">
                <input type="text" value={this.state.url} onChange={this.handleChangeRemote} />
                <button type="button" onClick={this.handleClickRemote}>Load remote URL</button>
            </div>
            <div className="FileLoader-local">
              <DropzoneContainer onChange={this.handleChangeLocal} />
              <button type="button" onClick={this.handleClickLocal}>Load local File</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FileLoader;
