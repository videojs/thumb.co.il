'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mp4 = require('./mp4');

var _mp42 = _interopRequireDefault(_mp4);

var _ts = require('./ts');

var _ts2 = _interopRequireDefault(_ts);

var _flv = require('./flv');

var _flv2 = _interopRequireDefault(_flv);

exports['default'] = {
  mp4Inspector: _mp42['default'],
  tsInspector: _ts2['default'],
  flvInspector: _flv2['default']
};
module.exports = exports['default'];