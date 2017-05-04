import React, { Component } from 'react';
import DropzoneContainer from './DropzoneContainer';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import './FileLoader.css';

class FileLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
    };

    this.handleChangeLocal = this.handleChangeLocal.bind(this);
    this.handleChangeRemote = this.handleChangeRemote.bind(this);
    this.handleClickRemote = this.handleClickRemote.bind(this);
  }

  handleChangeLocal(file) {
    const requestInfo = {
      options: file,
      reset: true,
      location: 'local'
    };

    this.props.requestLoad(requestInfo);
    this.props.closeDrawer();
  }

  handleChangeRemote(event) {
    this.setState({
      url: event.target.value
    });
  }

  handleClickRemote(event) {
    if (event) {
      event.preventDefault();
    }

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
    this.props.closeDrawer();
  }

  render() {
    return (
      <div className="FileLoader">
        <form onSubmit={this.handleClickRemote}>
          <div className="FileLoader-options">
            <div className="FileLoader-local">
              <DropzoneContainer onChange={this.handleChangeLocal} />
            </div>
            <div className="FileLoader-remote">
                <TextField value={this.state.url} onChange={this.handleChangeRemote} style={{zIndex:1}} />
                <FlatButton
                  label="Load"
                  onTouchTap={this.handleClickRemote}
                  style={{zIndex:1, height: '48px', marginLeft: '20px'}}
                  backgroundColor="#b1c647"
                  hoverColor="#c1d42f"/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FileLoader;
