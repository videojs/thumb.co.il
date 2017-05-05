import React, { Component } from 'react';
import thumbcoil from 'thumbcoil';
//import rd3 from 'rd3';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  HorizontalBarSeries,
  VerticalBarSeries,
  makeWidthFlexible,
  LineSeries,
  MarkSeries,
  Crosshair,
  Hint,
  VerticalRectSeries
} from 'react-vis';

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

const sliceType = [
  'P',
  'B',
  'I',
  'SP',
  'SI',
  'P',
  'B',
  'I',
  'SP',
  'SI',
];

const sliceTypeColor = [
  '#77b3bb',
  '#b43665',
  '#b1c647',
  '#77b3bb',
  '#b1c647',
  '#77b3bb',
  '#b43665',
  '#b1c647',
  '#77b3bb',
  '#b1c647',
];

class GopView extends Component {
  constructor (props) {
    super(props);

    const videoFrames = this.props.packets
      .filter(es => es.type === 'video');
    const largestFrame = videoFrames.reduce((a, b) => Math.max(a, b.data.length), 0);
    const frameGops = videoFrames
      .sort((a, b) => {
        return this.props.sortDts ? a.dts - b.dts : a.pts - b.pts;
      })
      .reduce((arr, es, index) => {
        let last = arr[arr.length - 1];

        let obj = {
          x0: index,
          x: index + 1, //arr.length,
          y0: 0,
          y: es.data.length,
          color: es.nals.reduce((type, nal) => {
            if (type) return type;
            if (typeof nal.slice_type === 'number') {
              return sliceTypeColor[nal.slice_type];
            }
            return null;
          }, null),
          type:  es.nals.reduce((type, nal) => {
            if (type) return type;
            if (typeof nal.slice_type === 'number') {
              return sliceType[nal.slice_type];
            }
            return null;
          }, null)
        };

        if (!last) {
          last = [obj];
          arr.push(last);
          return arr;
        }

        if (obj.type === 'I') {
          last = [obj];
          arr.push(last);
          return arr;
        }

        last.push(obj);
        return arr;
      }, []);

    const frames = frameGops.reduce((a, b) => a.concat(b), []);

    let offset = 0;

    const gops = frameGops.map((g, i) => {
      const obj = {
        title: 'GOP ' + i,
        color: (g[0].type === 'I' ? '#88CC88' : '#EE8888'),
        y0: 0,
        y: -largestFrame / 20,
        x0: offset,
        x: offset + g.length
      };

      offset += g.length;
      return obj;
    });

    // console.log(frames);
    // console.log(gops);

    this.state = {
      name: this.props.name,
      crosshairValues: [],
      frames,
      gops
    };
  }

  /**
   * Event handler for onNearestX.
   * @param {Object} value Selected value.
   * @param {number} index Index of the series.
   * @private
   */
  _nearestXHandler = (value, {index}) => {
    const {frames} = this.state;
    this.setState({
      crosshairValues: [frames[index]]
    });
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _mouseLeaveHandler = () => {
    this.setState({crosshairValues: []});
  }

  render() {
    let {gops, frames, crosshairValues, name} = this.state;

    return (
      <div>
        <FlexibleXYPlot
          className="gopview"
          height={500}
          onMouseLeave={this._mouseLeaveHandler}
          colorType="literal">
          <VerticalRectSeries
            strokeWidth='1px'
            stroke='#ffffff'
            xAdjust={false}
            onNearestX={this._nearestXHandler}
            data={frames}/>
          <VerticalRectSeries
            className="gops"
            strokeWidth='1px'
            stroke='#ffffff'
            xAdjust={false}
            data={gops}/>
          <Crosshair
            values={crosshairValues}
            xAdjust={false}>
              <div className="crosshair">
                <h4>Frame Info</h4>
                <p>Number: {crosshairValues[0] && crosshairValues[0].x}</p>
                <p>Type: {crosshairValues[0] && crosshairValues[0].type}</p>
                <p>Size: {crosshairValues[0] && crosshairValues[0].y + ' bytes'}</p>
              </div>
          </Crosshair>
        </FlexibleXYPlot>
      </div>
    );
  }
}

export default GopView;
