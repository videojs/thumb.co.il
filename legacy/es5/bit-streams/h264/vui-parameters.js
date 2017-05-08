'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libCombinators = require('../../lib/combinators');

var _libConditionals = require('../../lib/conditionals');

var _libDataTypes = require('../../lib/data-types');

var _hdrParameters = require('./hdr-parameters');

var _hdrParameters2 = _interopRequireDefault(_hdrParameters);

var v = null;

var sampleRatioCalc = (0, _libCombinators.list)([
/*
  1:1
 7680x4320 16:9 frame without horizontal overscan
 3840x2160 16:9 frame without horizontal overscan
 1280x720 16:9 frame without horizontal overscan
 1920x1080 16:9 frame without horizontal overscan (cropped from 1920x1088)
 640x480 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 1), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(1))),
/*
  12:11
 720x576 4:3 frame with horizontal overscan
 352x288 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 2), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(12 / 11))),
/*
  10:11
 720x480 4:3 frame with horizontal overscan
 352x240 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 3), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(10 / 11))),
/*
  16:11
 720x576 16:9 frame with horizontal overscan
 528x576 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 4), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(16 / 11))),
/*
  40:33
 720x480 16:9 frame with horizontal overscan
 528x480 4:3 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 5), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(40 / 33))),
/*
  24:11
 352x576 4:3 frame without horizontal overscan
 480x576 16:9 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 6), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(24 / 11))),
/*
  20:11
 352x480 4:3 frame without horizontal overscan
 480x480 16:9 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 7), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(20 / 11))),
/*
  32:11
 352x576 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 8), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(32 / 11))),
/*
  80:33
 352x480 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 9), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(80 / 33))),
/*
  18:11
 480x576 4:3 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 10), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(18 / 11))),
/*
  15:11
 480x480 4:3 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 11), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(15 / 11))),
/*
  64:33
 528x576 16:9 frame with horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 12), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(64 / 33))),
/*
  160:99
 528x480 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 13), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(160 / 99))),
/*
  4:3
 1440x1080 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 14), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(4 / 3))),
/*
  3:2
 1280x1080 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 15), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(3 / 2))),
/*
  2:1
 960x1080 16:9 frame without horizontal overscan
 */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 16), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(2 / 1))),
/* Extended_SAR */
(0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_idc', 255), (0, _libCombinators.list)([(0, _libCombinators.data)('sar_width', (0, _libDataTypes.u)(16)), (0, _libCombinators.data)('sar_height', (0, _libDataTypes.u)(16)), (0, _libCombinators.data)('sample_ratio', (0, _libDataTypes.val)(function (expGolomb, output, options) {
  return output.sar_width / output.sar_height;
}))]))]);

var vuiParamters = (0, _libCombinators.list)([(0, _libCombinators.data)('aspect_ratio_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('aspect_ratio_info_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('aspect_ratio_idc', (0, _libDataTypes.u)(8)), sampleRatioCalc])), (0, _libCombinators.data)('overscan_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('overscan_info_present_flag', 1), (0, _libCombinators.data)('overscan_appropriate_flag', (0, _libDataTypes.u)(1))), (0, _libCombinators.data)('video_signal_type_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('video_signal_type_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('video_format', (0, _libDataTypes.u)(3)), (0, _libCombinators.data)('video_full_range_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('colour_description_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('colour_description_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('colour_primaries', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('transfer_characteristics', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('matrix_coefficients', (0, _libDataTypes.u)(8))]))])), (0, _libCombinators.data)('chroma_loc_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_loc_info_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_sample_loc_type_top_field', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('chroma_sample_loc_type_bottom_field', (0, _libDataTypes.ue)(v))])), (0, _libCombinators.data)('timing_info_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('timing_info_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('num_units_in_tick', (0, _libDataTypes.u)(32)), (0, _libCombinators.data)('time_scale', (0, _libDataTypes.u)(32)), (0, _libCombinators.data)('fixed_frame_rate_flag', (0, _libDataTypes.u)(1))])), (0, _libCombinators.data)('nal_hrd_parameters_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('nal_hrd_parameters_present_flag', 1), _hdrParameters2['default']), (0, _libCombinators.data)('vcl_hrd_parameters_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('vcl_hrd_parameters_present_flag', 1), _hdrParameters2['default']), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.equals)('nal_hrd_parameters_present_flag', 1), (0, _libConditionals.equals)('vcl_hrd_parameters_present_flag', 1)]), (0, _libCombinators.data)('low_delay_hrd_flag', (0, _libDataTypes.u)(1))), (0, _libCombinators.data)('pic_struct_present_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('bitstream_restriction_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('bitstream_restriction_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('motion_vectors_over_pic_boundaries_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('max_bytes_per_pic_denom', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('max_bits_per_mb_denom', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('log2_max_mv_length_horizontal', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('log2_max_mv_length_vertical', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('max_num_reorder_frames', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('max_dec_frame_buffering', (0, _libDataTypes.ue)(v))]))]);

exports['default'] = vuiParamters;
module.exports = exports['default'];