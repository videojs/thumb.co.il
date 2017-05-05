import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';

import './FrameInfo.css';

const attributes = ['size', 'flags', 'type', 'version'];
const specialProperties = ['boxes', 'nals', 'samples', 'packetCount'];

const isObj = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export class FrameInfo extends Component {
  render() {
    const box =this.props.box;
    const boxProperties = Object.keys(box).filter((key) => {
      return isObj(box[key]) ||
             (Array.isArray(box[key]) && isObj(box[key][0]));
    });
    const exclusions = attributes.concat(specialProperties).concat(boxProperties);

    const subProperties = Object.keys(box).filter((key) => {
      return exclusions.indexOf(key) === -1;
    }).map((key, index) => {
      return (
        <div className="Box-property" key={index}>
          <div className="Box-property-name">{key.toString()}</div>
          <div className="Box-property-value">{box[key].toString()}</div>
        </div>
      );
    });

    const subBoxes = [];

    if (box.boxes && box.boxes.length) {
      box.boxes.forEach((subBox, index) => {
        subBoxes.push(<FrameInfo box={subBox} key={index} />);
      });
    } else if (boxProperties.length) {
      boxProperties.forEach((key, index) => {
        if (Array.isArray(box[key])) {
          let subBox = {
            type: key,
            boxes: box[key],
            size: box[key].size
          };

          subBoxes.push(<FrameInfo box={subBox} key={index} />);
        } else {
          subBoxes.push(<FrameInfo box={box[key]} key={index} />);
        }
      });
    }

    return (
      <div className="FrameInfo">
        <div className="FrameInfoType">{this.props.box.type}</div>
        {subProperties.length ?
          (<div className="Box-properties">
            {subProperties}
          </div>) : null
        }
        {subBoxes.length ?
          (<div className="Box-boxes">
            {subBoxes}
          </div>) : null
        }
      </div>
    );
  }
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
