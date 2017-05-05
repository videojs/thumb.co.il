import React, { Component } from 'react';
import './Box.css';

const attributes = ['size', 'flags', 'type', 'version'];
const specialProperties = ['data', 'tsPacketIndices', 'boxes', 'nals', 'samples', 'packetCount'];

const isObj = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

class BoxType extends Component {
  render() {
    const type = this.props.type;

    if (type === null) {
      return null;
    }

    return (
      <div className="box-type" onClick={this.props.onClick}>{type}</div>
    );
  }
}

class BoxProperty extends Component {
  render() {
    const name = this.props.name.toString();
    const value = this.props.value.toString();

    return (
      <div className="box-property">
        <h3 className="box-property-name">{name}</h3>
        <div className="box-property-value">{value}</div>
      </div>
    );
  }
}

class Box extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.collapsed === undefined ? true : false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const box = this.props.box;
    const boxProperties = Object.keys(box).filter((key) => {
      return isObj(box[key]) ||
             (Array.isArray(box[key]) && isObj(box[key][0]));
    });
    const exclusions = attributes.concat(specialProperties).concat(boxProperties);

    const subProperties = Object.keys(box).filter((key) => {
      return exclusions.indexOf(key) === -1;
    }).map((key, index) => {
      return <BoxProperty name={key} value={box[key]} key={index} />
    });
    const subBoxes = [];

    if (box.boxes && box.boxes.length) {
      box.boxes.forEach((subBox, index) => {
        subBoxes.push(<Box box={subBox} key={index} />);
      });
    } else if (boxProperties.length) {
      boxProperties.forEach((key, index) => {
        if (Array.isArray(box[key])) {
          let subBox = {
            type: key,
            boxes: box[key],
            size: box[key].size
          };

          subBoxes.push(<Box box={subBox} key={index} />);
        } else {
          subBoxes.push(<Box box={box[key]} key={index} />);
        }
      });
    }

    const uncollapsed = (
      <div>
        <div className="box-properties">
          {subProperties}
        </div>
        <div className="box-boxes">
          {subBoxes}
        </div>
      </div>
    );

    const className = [
      'box',
      'box-' + box.type,
      'box-' + (this.state.collapsed ? 'collapsed' : 'showing')
    ].join(' ');

    return (
      <div className={className}>
        <BoxType type={box.type} onClick={this.handleClick} />
        {!this.state.collapsed && uncollapsed}
      </div>
    );
  }
}

export default Box;
