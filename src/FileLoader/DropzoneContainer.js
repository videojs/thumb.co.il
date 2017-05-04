import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server'
import DropzoneComponent from 'react-dropzone-component';
import IconButton from 'material-ui/IconButton';

import FileUpload from 'material-ui/svg-icons/file/file-upload';
// import '../../node_modules/react-dropzone-component/styles/filepicker.css';


class DropzoneContainer extends Component {
  constructor(props) {
    super(props);

    const previewTemplate = (
      <div className="dz-preview dz-file-preview well" id="dz-preview-template">

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

  handleDrop(file) {
    this.props.onChange(file);
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
      addedfile: this.handleDrop.bind(this)
    }

    return (
      <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig}>
        <IconButton className="dz-message" style={{border: 'solid 2px #eee', padding: '0'}}><FileUpload color="#eee" /><div className="upload-icon-text">Upload</div></IconButton>
      </DropzoneComponent>
    );
  }
}

export default DropzoneContainer;
