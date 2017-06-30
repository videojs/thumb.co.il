import React, { Component } from 'react';
import AppHeader from './AppHeader';
import MediaContainer from './Media/MediaContainer';
import ManifestContainer from './Manifest/ManifestContainer';
import Load from './LoaderUtils'
import logo from './thumbcoil_logo.svg';
import m3u8 from 'm3u8-parser';
import './App.css';
import ga from 'react-google-analytics';

const GAInitiailizer = ga.Initializer;
const initialState = function() {
  return {
    media: null,
    manifest: null,
  };
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState();

    this.requestLoad = this.requestLoad.bind(this);
    this.selectMedia = this.selectMedia.bind(this);

    ga('create', 'UA-96900670-1', 'auto');
    ga('send', 'pageview');
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
      ga('send', 'event', {
        eventCategory: 'App',
        eventAction: 'loading HLS'
      });
       this.loadedManifest(data);
    } else if(/\.ts/i.test(data.name)){
      ga('send', 'event', {
        eventCategory: 'App',
        eventAction: 'loading MPEG2-TS'
      });
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
    const requestInfo = {
      options: {
        url: media.resolvedUri,
        headers: media.xhrHeaders
      },
      location: 'remote',
      reset: false
    };

    if (media.key) {
      requestInfo.options.key = {
        uri: media.key.resolvedUri,
        iv: media.key.iv
      };
    }

    this.setState({
      media: null
    });

    this.requestLoad(requestInfo);
  }

  render() {
    let appContent;

    if (this.state.manifest || this.state.media) {
      appContent = (
        <div className="App-content">
          {this.state.manifest && <ManifestContainer manifest={this.state.manifest} selectMedia={this.selectMedia} /> }
          {this.state.media && <MediaContainer name={this.state.media.name} bytes={this.state.media.bytes} /> }
        </div>
      );
    } else {
      appContent = (
        <div className="App-content">
          <div className="App-no-content">
            <h2>Load an HLS playlist or an individual MPEG2-TS segment above to begin.</h2>
            <h3>Thumbcoil magically runs within the browser so your video data will <strong>NEVER</strong> be transmitted to a server.</h3>
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <AppHeader requestLoad={this.requestLoad} />
        {appContent}
        <GAInitiailizer />
      </div>
    );
  }
}

export default App;
