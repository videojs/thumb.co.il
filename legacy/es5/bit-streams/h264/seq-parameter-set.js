'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCombinators = require('../../lib/combinators');

var _libConditionals = require('../../lib/conditionals');

var _libDataTypes = require('../../lib/data-types');

var _scalingList = require('./scaling-list');

var _scalingList2 = _interopRequireDefault(_scalingList);

var _vuiParameters = require('./vui-parameters');

var _vuiParameters2 = _interopRequireDefault(_vuiParameters);

var v = null;

var PROFILES_WITH_OPTIONAL_SPS_DATA = [44, 83, 86, 100, 110, 118, 122, 128, 134, 138, 139, 244];

var getChromaFormatIdcValue = {
  read: function read(expGolomb, output, options, index) {
    return output.chroma_format_idc || options.chroma_format_idc;
  },
  write: function write() {}
};

/**
  * NOW we are ready to build an SPS parser!
  */
var spsCodec = (0, _libCombinators.start)('seq_parameter_set', (0, _libCombinators.list)([
// defaults
(0, _libCombinators.data)('chroma_format_idc', (0, _libDataTypes.val)(1)), (0, _libCombinators.data)('video_format', (0, _libDataTypes.val)(5)), (0, _libCombinators.data)('color_primaries', (0, _libDataTypes.val)(2)), (0, _libCombinators.data)('transfer_characteristics', (0, _libDataTypes.val)(2)), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(1.0)), (0, _libCombinators.data)('profile_idc', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('constraint_set0_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set1_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set2_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set3_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set4_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set5_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set6_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constraint_set7_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('level_idc', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('seq_parameter_set_id', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('profile_idc', PROFILES_WITH_OPTIONAL_SPS_DATA), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_format_idc', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_format_idc', 3), (0, _libCombinators.data)('separate_colour_plane_flag', (0, _libDataTypes.u)(1))), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('chroma_format_idc', 3)), (0, _libCombinators.data)('separate_colour_plane_flag', (0, _libDataTypes.val)(0))), (0, _libCombinators.data)('bit_depth_luma_minus8', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('bit_depth_chroma_minus8', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('qpprime_y_zero_transform_bypass_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('seq_scaling_matrix_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('seq_scaling_matrix_present_flag', 1), (0, _libConditionals.each)(function (index, output) {
  return index < (output.chroma_format_idc !== 3 ? 8 : 12);
}, (0, _libCombinators.list)([(0, _libCombinators.data)('seq_scaling_list_present_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('seq_scaling_list_present_flag[]', 1), _scalingList2['default'])])))])), (0, _libCombinators.data)('log2_max_frame_num_minus4', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('pic_order_cnt_type', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_order_cnt_type', 0), (0, _libCombinators.data)('log2_max_pic_order_cnt_lsb_minus4', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_order_cnt_type', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('delta_pic_order_always_zero_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('offset_for_non_ref_pic', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('offset_for_top_to_bottom_field', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('num_ref_frames_in_pic_order_cnt_cycle', (0, _libDataTypes.ue)(v)), (0, _libConditionals.each)(function (index, output) {
  return index < output.num_ref_frames_in_pic_order_cnt_cycle;
}, (0, _libCombinators.data)('offset_for_ref_frame[]', (0, _libDataTypes.se)(v)))])), (0, _libCombinators.data)('max_num_ref_frames', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('gaps_in_frame_num_value_allowed_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('pic_width_in_mbs_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('pic_height_in_map_units_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_mbs_only_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('frame_mbs_only_flag', 0), (0, _libCombinators.data)('mb_adaptive_frame_field_flag', (0, _libDataTypes.u)(1))), (0, _libCombinators.data)('direct_8x8_inference_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('frame_cropping_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('frame_cropping_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('frame_crop_left_offset', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_crop_right_offset', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_crop_top_offset', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('frame_crop_bottom_offset', (0, _libDataTypes.ue)(v))])), (0, _libCombinators.data)('vui_parameters_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('vui_parameters_present_flag', 1), _vuiParameters2['default']),
// The following field is a derived value that is used for parsing
// slice headers
(0, _libConditionals.when)((0, _libConditionals.equals)('separate_colour_plane_flag', 1), (0, _libCombinators.data)('ChromaArrayType', (0, _libDataTypes.val)(0))), (0, _libConditionals.when)((0, _libConditionals.equals)('separate_colour_plane_flag', 0), (0, _libCombinators.data)('ChromaArrayType', getChromaFormatIdcValue)), (0, _libCombinators.verify)('seq_parameter_set')]));

exports['default'] = spsCodec;
module.exports = exports['default'];