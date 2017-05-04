import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

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
      <ListItem style={{paddingLeft: '20px'}} primaryText={this.props.segment.uri} onTouchTap={this.handleClick} />
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
        <ListItem
          primaryTogglesNestedList={true}
          style={{paddingRight: '30px'}}
          primaryText={this.props.playlist.uri}
          initiallyOpen={false}
          nestedItems={segments}
        />
      </div>
    );

      // <div className="ManifestTreePlaylist">
        // <div className="ManifestTreePlaylist-playlist" onClick={this.handleClick}>{this.props.playlist.uri}</div>
        // {this.props.showing && (<div className="ManifestTreePlaylist-segments">{segments}</div>)}
      // </div>
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
                selectMedia={this.props.selectMedia} />
    });

    return (
      <List className="ManifestTree">
        <Subheader style={{borderBottom: '2px solid #ccc'}}>Manifest Explorer</Subheader>
        <div className="ManifestTree-playlists">
          {playlists}
        </div>
      </List>
    );
  }
}

export default ManifestTree;
