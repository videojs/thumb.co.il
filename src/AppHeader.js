import React, { Component } from 'react';
import FileLoader from './FileLoader/FileLoader';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

import logo from './thumbcoil_logo.svg';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import './AppHeader.css';

class AppHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    };

    this.handleExpandTap = this.handleExpandTap.bind(this);
  }

  handleExpandTap() {
    this.setState((prevState) => {
      return {
        open: !prevState.open
      };
    });
  }

  render() {
    const appLogo = (
      <div className="App-logo">
        <img src={logo} />
      </div>
    );
    const appInfo = (
      <div className="App-info">
        <h2 className="App-description">The only 100% browser-based video inspector</h2>
        <h3 className="App-sub-description">Deeply inspect the structure of an MPEG-2 Transport Stream including H.264 and AAC bitstreams!</h3>
      </div>
    );
    const appFileloader = (
      <div className="App-fileloader">
        <FileLoader requestLoad={ this.props.requestLoad } closeDrawer={this.handleExpandTap} />
      </div>
    );
    const expandIcon = (
      <IconButton onTouchTap={this.handleExpandTap}>{this.state.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
    );

    let appHeaderClassName = 'AppHeader';

    const barStyle = {
      fontFamily: 'Text Me One, sans-serif',
      backgroundColor: '#333'
    };

    if (this.state.open) {
      appHeaderClassName += ' AppHeader-drawer-open';
      barStyle.boxShadow = 'none';
    }

    const drawer = (
      <div className="AppHeader-drawer-container">
        <div className="AppHeader-drawer">
          {appInfo}
          {appFileloader}
        </div>
      </div>
    );

    return (
      <div className={appHeaderClassName}>
        <AppBar
          title="thumb.co.il"
          titleStyle={{
            marginLeft: '5px',
            display: 'inline-block',
            flex: 'none'
          }}
          iconElementLeft={appLogo}
          iconElementRight={expandIcon}
          style={barStyle}
        />
        {drawer}
      </div>
    );
  }
}

export default AppHeader;
