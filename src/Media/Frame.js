import React, { Component } from 'react';
import Box from '../Box';
import {List, ListItem} from 'material-ui/List';

import './FrameInfo.css';

export function FrameInfo(props) {
  <Box box={props.box} collapsed={false}/>

  return (
    <div className="FrameInfo">
      <Box box={props.box} collapsed={false}/>
    </div>
  );
}

class FrameListItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.selectFrame(this.props.index);
  }

  render() {
    const classes = ['FrameListItem', 'FrameListItem-type-' + this.props.type];

    if (this.props.active) {
      classes.push('FrameListItem-active');
    }

    return (
      <ListItem className={classes.join(' ')} onTouchTap={this.handleClick} primaryText={this.props.type}/>
    );
  }
}

export class FrameList extends Component {
  render() {
    const frames = this.props.packets.map((packet, index) => {
      return (
        <FrameListItem
          type={packet.type}
          key={index}
          index={index}
          selectFrame={this.props.selectFrame}
          active={index === this.props.currentFrame}
        />
      );
    });

    return (
      <div className="FrameList">
        <List>{frames}</List>
      </div>
    );
  }
}

export default {
  FrameList,
  FrameInfo
};
