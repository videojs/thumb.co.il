'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libCombinators = require('../../lib/combinators');

var _libDataTypes = require('../../lib/data-types');

var audCodec = (0, _libCombinators.start)('access_unit_delimiter', (0, _libCombinators.list)([(0, _libCombinators.data)('primary_pic_type', (0, _libDataTypes.u)(3)), (0, _libCombinators.verify)('access_unit_delimiter')]));

exports['default'] = audCodec;
module.exports = exports['default'];