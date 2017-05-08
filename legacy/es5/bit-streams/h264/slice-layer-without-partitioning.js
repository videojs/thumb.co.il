'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sliceHeader = require('./slice-header');

var _sliceHeader2 = _interopRequireDefault(_sliceHeader);

var _libCombinators = require('../../lib/combinators');

var sliceLayerWithoutPartitioningCodec = (0, _libCombinators.start)('slice_layer_without_partitioning', (0, _libCombinators.list)([_sliceHeader2['default']
// TODO: slice_data
]));

exports['default'] = sliceLayerWithoutPartitioningCodec;
module.exports = exports['default'];