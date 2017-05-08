'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libCombinators = require('../../lib/combinators');

var _libConditionals = require('../../lib/conditionals');

var _libDataTypes = require('../../lib/data-types');

var v = null;

var sliceType = {
  P: [0, 5],
  B: [1, 6],
  I: [2, 7],
  SP: [3, 8],
  SI: [4, 9]
};

/**
 * Functions for calculating the number of bits to read for certain
 * properties based on the values in other properties (usually specified
 * in the SPS)
 */
var frameNumBits = function frameNumBits(expGolomb, data, options, index) {
  return options.log2_max_frame_num_minus4 + 4;
};

var picOrderCntBits = function picOrderCntBits(expGolomb, data, options, index) {
  return options.log2_max_pic_order_cnt_lsb_minus4 + 4;
};

var sliceGroupChangeCycleBits = function sliceGroupChangeCycleBits(expGolomb, data, options, index) {
  var picHeightInMapUnits = options.pic_height_in_map_units_minus1 + 1;
  var picWidthInMbs = options.pic_width_in_mbs_minus1 + 1;
  var sliceGroupChangeRate = options.slice_group_change_rate_minus1 + 1;
  var picSizeInMapUnits = picWidthInMbs * picHeightInMapUnits;

  return Math.ceil(Math.log(picSizeInMapUnits / sliceGroupChangeRate + 1) / Math.LN2);
};

var useWeightedPredictionTable = (0, _libConditionals.some)([(0, _libConditionals.every)([(0, _libConditionals.equals)('weighted_pred_flag', 1), (0, _libConditionals.some)([(0, _libConditionals.inArray)('slice_type', sliceType.P), (0, _libConditionals.inArray)('slice_type', sliceType.SP)])]), (0, _libConditionals.every)([(0, _libConditionals.equals)('weighted_bipred_idc', 1), (0, _libConditionals.inArray)('slice_type', sliceType.B)])]);

var refPicListModification = (0, _libCombinators.list)([(0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.I)), (0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.SI))]), (0, _libCombinators.list)([(0, _libCombinators.data)('ref_pic_list_modification_flag_l0', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('ref_pic_list_modification_flag_l0', 1), (0, _libConditionals.each)(function (index, output) {
  return index === 0 || output.modification_of_pic_nums_idc_l0[index - 1] !== 3;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('modification_of_pic_nums_idc_l0[]', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('modification_of_pic_nums_idc_l0[]', [0, 1]), (0, _libCombinators.data)('abs_diff_pic_num_minus1_l0[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('modification_of_pic_nums_idc_l0[]', 2), (0, _libCombinators.data)('long_term_pic_num_l0[]', (0, _libDataTypes.ue)(v)))])))])), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libCombinators.list)([(0, _libCombinators.data)('ref_pic_list_modification_flag_l1', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('ref_pic_list_modification_flag_l1', 1), (0, _libConditionals.each)(function (index, output) {
  return index === 0 || output.modification_of_pic_nums_idc_l1[index - 1] !== 3;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('modification_of_pic_nums_idc_l1[]', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('modification_of_pic_nums_idc_l1[]', [0, 1]), (0, _libCombinators.data)('abs_diff_pic_num_minus1_l1[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('modification_of_pic_nums_idc_l1[]', 2), (0, _libCombinators.data)('long_term_pic_num_l1[]', (0, _libDataTypes.ue)(v)))])))]))]);

var refPicListMvcModification = {
  encode: function encode() {
    throw new Error('ref_pic_list_mvc_modification: NOT IMPLEMENTED!');
  },
  decode: function decode() {
    throw new Error('ref_pic_list_mvc_modification: NOT IMPLEMENTED!');
  }
};

var predWeightTable = (0, _libCombinators.list)([(0, _libCombinators.data)('luma_log2_weight_denom', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('ChromaArrayType', 0)), (0, _libCombinators.data)('chroma_log2_weight_denom', (0, _libDataTypes.ue)(v))), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_ref_idx_l0_active_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l0_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('luma_weight_l0_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l0[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('luma_offset_l0[]', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('ChromaArrayType', 0)), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l0_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_weight_l0_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l0_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l0_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_weight_l0_Cb[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l0_Cb[]', (0, _libDataTypes.se)(v))]))]))]))])), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_ref_idx_l1_active_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l1_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('luma_weight_l1_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('luma_weight_l1[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('luma_offset_l1[]', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('ChromaArrayType', 0)), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l1_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('chroma_weight_l1_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('chroma_weight_l1_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l1_Cr[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_weight_l1_Cb[]', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_offset_l1_Cb[]', (0, _libDataTypes.se)(v))]))]))]))])))]);

var decRefPicMarking = (0, _libCombinators.list)([(0, _libConditionals.when)((0, _libConditionals.equals)('nal_unit_type', 5), (0, _libCombinators.list)([(0, _libCombinators.data)('no_output_of_prior_pics_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('long_term_reference_flag', (0, _libDataTypes.u)(1))])), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('nal_unit_type', 5)), (0, _libCombinators.list)([(0, _libCombinators.data)('adaptive_ref_pic_marking_mode_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('adaptive_ref_pic_marking_mode_flag', 1), (0, _libConditionals.each)(function (index, output) {
  return index === 0 || output.memory_management_control_operation[index - 1] !== 0;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('memory_management_control_operation[]', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [1, 3]), (0, _libCombinators.data)('difference_of_pic_nums_minus1[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [2]), (0, _libCombinators.data)('long_term_pic_num[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [3, 6]), (0, _libCombinators.data)('long_term_frame_idx[]', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('memory_management_control_operation[]', [4]), (0, _libCombinators.data)('max_long_term_frame_idx_plus1[]', (0, _libDataTypes.ue)(v)))])))]))]);

var sliceHeader = (0, _libCombinators.list)([(0, _libCombinators.data)('first_mb_in_slice', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('slice_type', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('pic_parameter_set_id', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('separate_colour_plane_flag', 1), (0, _libCombinators.data)('colour_plane_id', (0, _libDataTypes.u)(2))), (0, _libCombinators.data)('frame_num', (0, _libDataTypes.u)(frameNumBits)), (0, _libConditionals.when)((0, _libConditionals.equals)('frame_mbs_only_flag', 0), (0, _libCombinators.list)([(0, _libCombinators.data)('field_pic_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('field_pic_flag', 1), (0, _libCombinators.data)('bottom_field_flag', (0, _libDataTypes.u)(1)))])), (0, _libConditionals.when)((0, _libConditionals.equals)('idrPicFlag', 1), (0, _libCombinators.data)('idr_pic_id', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_order_cnt_type', 0), (0, _libCombinators.list)([(0, _libCombinators.data)('pic_order_cnt_lsb', (0, _libDataTypes.u)(picOrderCntBits)), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('bottom_field_pic_order_in_frame_present_flag', 1), (0, _libConditionals.not)((0, _libConditionals.equals)('field_pic_flag', 1))]), (0, _libCombinators.data)('delta_pic_order_cnt_bottom', (0, _libDataTypes.se)(v)))])), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('pic_order_cnt_type', 1), (0, _libConditionals.not)((0, _libConditionals.equals)('delta_pic_order_always_zero_flag', 1))]), (0, _libCombinators.list)([(0, _libCombinators.data)('delta_pic_order_cnt[0]', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('bottom_field_pic_order_in_frame_present_flag', 1), (0, _libConditionals.not)((0, _libConditionals.equals)('field_pic_flag', 1))]), (0, _libCombinators.data)('delta_pic_order_cnt[1]', (0, _libDataTypes.se)(v)))])), (0, _libConditionals.when)((0, _libConditionals.equals)('redundant_pic_cnt_present_flag', 1), (0, _libCombinators.data)('redundant_pic_cnt', (0, _libDataTypes.ue)(v))), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libCombinators.data)('direct_spatial_mv_pred_flag', (0, _libDataTypes.u)(1))), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.inArray)('slice_type', sliceType.P), (0, _libConditionals.inArray)('slice_type', sliceType.SP), (0, _libConditionals.inArray)('slice_type', sliceType.B)]), (0, _libCombinators.list)([(0, _libCombinators.data)('num_ref_idx_active_override_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('num_ref_idx_active_override_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('num_ref_idx_l0_active_minus1', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.B), (0, _libCombinators.data)('num_ref_idx_l1_active_minus1', (0, _libDataTypes.ue)(v)))]))])), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.equals)('nal_unit_type', 20), (0, _libConditionals.equals)('nal_unit_type', 21)]), refPicListMvcModification), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.not)((0, _libConditionals.equals)('nal_unit_type', 20)), (0, _libConditionals.not)((0, _libConditionals.equals)('nal_unit_type', 21))]), refPicListModification), (0, _libConditionals.when)(useWeightedPredictionTable, predWeightTable), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('nal_ref_idc', 0)), decRefPicMarking), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.equals)('entropy_coding_mode_flag', 1), (0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.I)), (0, _libConditionals.not)((0, _libConditionals.inArray)('slice_type', sliceType.SI))]), (0, _libCombinators.data)('cabac_init_idc', (0, _libDataTypes.ue)(v))), (0, _libCombinators.data)('slice_qp_delta', (0, _libDataTypes.se)(v)), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_type', sliceType.SP), (0, _libCombinators.data)('sp_for_switch_flag', (0, _libDataTypes.u)(1))), (0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.inArray)('slice_type', sliceType.SP), (0, _libConditionals.inArray)('slice_type', sliceType.SI)]), (0, _libCombinators.data)('slice_qs_delta', (0, _libDataTypes.se)(v))), (0, _libConditionals.when)((0, _libConditionals.equals)('deblocking_filter_control_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('disable_deblocking_filter_idc', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('disable_deblocking_filter_idc', 1)), (0, _libCombinators.list)([(0, _libCombinators.data)('slice_alpha_c0_offset_div2', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('slice_beta_offset_div2', (0, _libDataTypes.se)(v))]))])), (0, _libConditionals.when)((0, _libConditionals.every)([(0, _libConditionals.not)((0, _libConditionals.equals)('num_slice_groups_minus1', 0)), (0, _libConditionals.some)([(0, _libConditionals.equals)('slice_group_map_type', 3), (0, _libConditionals.equals)('slice_group_map_type', 4), (0, _libConditionals.equals)('slice_group_map_type', 5)])]), (0, _libCombinators.data)('slice_group_change_cycle', (0, _libDataTypes.u)(sliceGroupChangeCycleBits)))]);

exports['default'] = sliceHeader;
module.exports = exports['default'];