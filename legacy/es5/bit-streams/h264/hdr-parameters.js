'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCombinators = require('../../lib/combinators');

var _libDataTypes = require('../../lib/data-types');

var _libConditionals = require('../../lib/conditionals');

var _scalingList = require('./scaling-list');

var _scalingList2 = _interopRequireDefault(_scalingList);

var v = null;

var hdrParameters = (0, _libCombinators.list)([(0, _libCombinators.data)('cpb_cnt_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('bit_rate_scale', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('cpb_size_scale', (0, _libDataTypes.u)(4)), (0, _libConditionals.each)(function (index, output) {
  return index <= output.cpb_cnt_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('bit_rate_value_minus1[]', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('cpb_size_value_minus1[]', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('cbr_flag[]', (0, _libDataTypes.u)(1))])), (0, _libCombinators.data)('initial_cpb_removal_delay_length_minus1', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('cpb_removal_delay_length_minus1', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('dpb_output_delay_length_minus1', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('time_offset_length', (0, _libDataTypes.u)(5))]);

exports['default'] = hdrParameters;
module.exports = exports['default'];