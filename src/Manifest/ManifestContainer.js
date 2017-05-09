import React, { Component } from 'react';
import m3u8 from 'm3u8-parser';
import extend from 'extend';
import resolveUrl from './resolve-url';
import ManifestTree from './ManifestTree';
import ga from 'react-google-analytics';

/**
 * Turns segment byterange into a string suitable for use in
 * HTTP Range requests
 *
 * @param {Object} byterange - an object with two values defining the start and end
 *                             of a byte-range
 */
const byterangeStr = function(byterange) {
  let byterangeStart;
  let byterangeEnd;

  // `byterangeEnd` is one less than `offset + length` because the HTTP range
  // header uses inclusive ranges
  byterangeEnd = byterange.offset + byterange.length - 1;
  byterangeStart = byterange.offset;
  return 'bytes=' + byterangeStart + '-' + byterangeEnd;
};

/**
 * Defines headers for use in the xhr request for a particular segment.
 *
 * @param {Object} segment - a simplified copy of the segmentInfo object from SegmentLoader
 */
const segmentXhrHeaders = function(segment) {
  let headers = {};

  if (segment.byterange) {
    headers.Range = byterangeStr(segment.byterange);
  }
  return headers;
};

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
        if (!segment.xhrHeaders) {
          segment.xhrHeaders = segmentXhrHeaders(segment);
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
      ga('send', 'event', {
        eventCategory: 'ManifestContainer',
        eventAction: 'loadedMasterPlaylist'
      });
      this.state = {
        master: this.loadedMaster(manifest)
      };
    } else {
      // loaded media playlist
      ga('send', 'event', {
        eventCategory: 'ManifestContainer',
        eventAction: 'loadedMediaPlaylist'
      });
      this.state = {
        master: this.loadedMediaPlaylist(manifest)
      };
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
      return {
        master: updateMaster(prevState.master, manifest)
      }
    });
  }

  render() {
    return (
      <ManifestTree master={this.state.master} selectMedia={this.props.selectMedia} />
    );
  }
}

export default ManifestContainer;
