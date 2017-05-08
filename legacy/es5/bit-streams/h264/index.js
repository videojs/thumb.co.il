'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _accessUnitDelimiter = require('./access-unit-delimiter');

var _accessUnitDelimiter2 = _interopRequireDefault(_accessUnitDelimiter);

var _seqParameterSet = require('./seq-parameter-set');

var _seqParameterSet2 = _interopRequireDefault(_seqParameterSet);

var _picParameterSet = require('./pic-parameter-set');

var _picParameterSet2 = _interopRequireDefault(_picParameterSet);

var _sliceLayerWithoutPartitioning = require('./slice-layer-without-partitioning');

var _sliceLayerWithoutPartitioning2 = _interopRequireDefault(_sliceLayerWithoutPartitioning);

var _libDiscardEmulationPrevention = require('../../lib/discard-emulation-prevention');

var _libDiscardEmulationPrevention2 = _interopRequireDefault(_libDiscardEmulationPrevention);

var _supplementalEnhancementInformation = require('./supplemental-enhancement-information');

var _supplementalEnhancementInformation2 = _interopRequireDefault(_supplementalEnhancementInformation);

var h264Codecs = {
  accessUnitDelimiter: _accessUnitDelimiter2['default'],
  seqParameterSet: _seqParameterSet2['default'],
  picParameterSet: _picParameterSet2['default'],
  sliceLayerWithoutPartitioning: _sliceLayerWithoutPartitioning2['default'],
  discardEmulationPrevention: _libDiscardEmulationPrevention2['default'],
  supplementalEnhancementInformation: _supplementalEnhancementInformation2['default']
};

exports['default'] = h264Codecs;
module.exports = exports['default'];