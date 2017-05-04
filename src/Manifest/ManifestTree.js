import React, { Component } from 'react';
import './ManifestTree.css';

class ManifestTreeSegment extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.selectMedia(this.props.segment);
  }

  render() {
    return (
      <div>
        <div className="ManifestTreeSegment" onClick={this.handleClick}>{this.props.segment.uri}</div>
      </div>
    );
  }
}

class ManifestTreePlaylist extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.toggleShowing(this.props.index);
  }

  render() {
    let segments = [];

    if (this.props.playlist.segments) {
      segments = this.props.playlist.segments.map((segment, index) => {
        return <ManifestTreeSegment segment={segment} key={index + '-' + segment.uri} selectMedia={this.props.selectMedia} />
      });
    }

    return (
      <div className="ManifestTreePlaylist">
        <div className="ManifestTreePlaylist-playlist" onClick={this.handleClick}>{this.props.playlist.uri}</div>
        {this.props.showing && (<div className="ManifestTreePlaylist-segments">{segments}</div>)}
      </div>
    );
  }
}

class ManifestTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: this.props.master.playlists.map(() => {
        return false;
      })
    };

    this.toggleShowing = this.toggleShowing.bind(this);
  }

  toggleShowing(index) {
    this.setState((previousState) => {
      return {
        showing: previousState.showing.map((show, i) => {
          return i === index ? !show : show;
        })
      };
    })
  }

  render() {
    const playlists = this.props.master.playlists.map((playlist, index) => {
      return <ManifestTreePlaylist
                playlist={playlist}
                index={index}
                key={playlist.uri}
                showing={this.state.showing[index]}
                toggleShowing={this.toggleShowing}
                selectMedia={this.props.selectMedia} />
    });

    return (
      <div className="ManifestTree">
        <div className="ManifestTree-title">Manifest Explorer</div>
        <div className="ManifestTree-playlists">
          {playlists}
        </div>
      </div>
    );
  }
}

export default ManifestTree;
