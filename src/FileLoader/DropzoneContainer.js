import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server'
import DropzoneComponent from 'react-dropzone-component';
import '../../node_modules/react-dropzone-component/styles/filepicker.css';


class DropzoneContainer extends Component {
  constructor(props) {
    super(props);

    const previewTemplate = (
      <div className="dz-preview dz-file-preview well" id="dz-preview-template">
        <div className="dz-details">
          <div className="dz-filename"><span data-dz-name></span></div>
          <div className="dz-size" data-dz-size></div>
        </div>
      </div>
    );

    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
    this.djsConfig = {
        addRemoveLinks: true,
        acceptedFiles: ".ts,application/x-mpegURL,.m3u8",
        autoProcessQueue: false,
        previewTemplate: ReactDOMServer.renderToStaticMarkup(previewTemplate)
    };

    this.componentConfig = {
        showFiletypeIcon: false,
        postUrl: 'no-url'
    };

    this.dropzone = null;
  }

  handleInit(dropzone) {
    this.dropzone = dropzone;
  }

  handleDrop(event) {
    if (this.dropzone) {
      this.dropzone.removeAllFiles();
    }
  }

  render() {
    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    // For a list of all possible events (there are many), see README.md!
    const eventHandlers = {
      init: this.handleInit.bind(this),
      drop: this.handleDrop.bind(this),
      addedfile: this.props.onChange
    }

    const big = {
      fontSize: '14px',
      display: 'block'
    };

    const small = {
      fontSize: '12px',
      display: 'block'
    };

    return (
      <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig}>
        <div className="dz-message">
          <span style={big}>Drop file here</span>
          <span style={small}>(or click to browse)</span>
        </div>
      </DropzoneComponent>
    );
  }
}

export default DropzoneContainer;
