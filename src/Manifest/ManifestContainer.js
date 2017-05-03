import React, { Component } from 'react';
import m3u8 from 'm3u8-parser';
import extend from 'extend';
import resolveUrl from './resolve-url';
import ManifestTree from './ManifestTree';

const parse = function(text) {
  const parser = new m3u8.Parser();

  parser.push(text);
  parser.end();

  return parser.manifest;
}

const updateMaster = function(master, manifest) {
  const update = extend(true, {}, master);

  let i = update.playlists.length;

  while (i--) {
    let playlist = update.playlists[i];

    if (playlist.uri === manifest.uri) {
      update.playlists[i] = extend(true, {}, playlist, manifest);
      update.playlists[manifest.uri] = update.playlists[i];

      // resolve any missing segment and key URIs
      let j = 0;
      if (update.playlists[i].segments) {
        j = update.playlists[i].segments.length;
      }
      while (j--) {
        let segment = update.playlists[i].segments[j];
        if (!segment.resolvedUri) {
          segment.resolvedUri = resolveUrl(playlist.resolvedUri, segment.uri);
        }
        if (segment.key && !segment.key.resolvedUri) {
          segment.key.resolvedUri = resolveUrl(playlist.resolvedUri, segment.key.uri);
        }
        if (segment.map && !segment.map.resolvedUri) {
          segment.map.resolvedUri = resolveUrl(playlist.resolvedUri, segment.map.uri);
        }
      }
    }
  }

  return update;
}

const MEDIA_GROUPS = ['AUDIO', 'VIDEO', 'SUBTITLES', 'CLOSED-CAPTIONS'];

class ManifestContainer extends Component {
  constructor(props) {
    super(props);

    let manifest = parse(this.props.manifest.text);

    if (manifest.playlists) {
      // loaded master
      this.state = this.loadedMaster(manifest);
    } else {
      // loaded media playlist
      this.state = this.loadedMediaPlaylist(manifest);
    }
  }

  loadedMaster(manifest) {
    const master = extend(true, {}, manifest);

    master.uri = this.props.manifest.uri;

    // resolve any media groups
    MEDIA_GROUPS.forEach((mediaType) => {
      for (let groupKey in master.mediaGroups[mediaType]) {
        for (let labelKey in master.mediaGroups[mediaType][groupKey]) {
          let mediaProperties = master.mediaGroups[mediaType][groupKey][labelKey];

          if (mediaProperties.uri) {
            mediaProperties.resolvedUri =
              resolveUrl(master.uri, mediaProperties.uri);
          }
        }
      }
    });

    let i = master.playlists.length;

    while (i--) {
      let playlist = master.playlists[i];

      master.playlists[playlist.uri] = playlist;
      playlist.resolvedUri = resolveUrl(master.uri, playlist.uri);
      this.loadPlaylist(playlist);
    }

    return master;
  }

  loadedMediaPlaylist(manifest) {
    const master = {
      mediaGroups: {},
      uri: this.props.manifest.uri,
      playlists: [{
        uri: this.props.manifest.uri
      }]
    };

    master.playlists[this.props.manifest.uri] = master.playlists[0];
    master.playlists[0].resolvedUri = this.props.manifest.uri;

    MEDIA_GROUPS.forEach((mediaType) => {
      master[mediaType] = {};
    });

    return updateMaster(master, manifest);
  }

  loadPlaylist(playlist) {
    let xhr = new XMLHttpRequest();

    xhr.responseType = 'text';
    xhr.addEventListener('load', () => {
      this.handlePlaylistLoad(xhr.response, playlist.uri);
    });
    xhr.open('GET', playlist.resolvedUri);
    xhr.send();
  }

  handlePlaylistLoad(response, uri) {
    this.setState((prevState) => {
      const manifest = parse(response);

      manifest.uri = uri;
      return updateMaster(prevState, manifest);
    });
  }

  render() {
    return (
      <ManifestTree master={this.state} />
    );
  }
}

export default ManifestContainer;
