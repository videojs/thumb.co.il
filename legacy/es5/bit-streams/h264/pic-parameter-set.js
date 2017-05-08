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

var v = null;

var ppsCodec = (0, _libCombinators.start)('pic_parameter_set', (0, _libCombinators.list)([(0, _libCombinators.data)('pic_parameter_set_id', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('seq_parameter_set_id', (0, _libDataTypes.ue)(v)),
//    pickOptions('sps', 'seq_parameter_set_id'),
(0, _libCombinators.data)('entropy_coding_mode_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('bottom_field_pic_order_in_frame_present_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('num_slice_groups_minus1', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('num_slice_groups_minus1', 0)), (0, _libCombinators.list)([(0, _libCombinators.data)('slice_group_map_type', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('slice_group_map_type', 0), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_slice_groups_minus1;
}, (0, _libCombinators.data)('run_length_minus1[]', (0, _libDataTypes.ue)(v)))), (0, _libConditionals.when)((0, _libConditionals.equals)('slice_group_map_type', 2), (0, _libConditionals.each)(function (index, output) {
  return index <= output.num_slice_groups_minus1;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('top_left[]', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('bottom_right[]', (0, _libDataTypes.ue)(v))]))), (0, _libConditionals.when)((0, _libConditionals.inArray)('slice_group_map_type', [3, 4, 5]), (0, _libCombinators.list)([(0, _libCombinators.data)('slice_group_change_direction_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('slice_group_change_rate_minus1', (0, _libDataTypes.ue)(v))])), (0, _libConditionals.when)((0, _libConditionals.equals)('slice_group_map_type', 6), (0, _libCombinators.list)([(0, _libCombinators.data)('pic_size_in_map_units_minus1', (0, _libDataTypes.ue)(v)), (0, _libConditionals.each)(function (index, output) {
  return index <= output.pic_size_in_map_units_minus1;
}, (0, _libCombinators.data)('slice_group_id[]', (0, _libDataTypes.ue)(v)))]))])), (0, _libCombinators.data)('num_ref_idx_l0_default_active_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('num_ref_idx_l1_default_active_minus1', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('weighted_pred_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('weighted_bipred_idc', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('pic_init_qp_minus26', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('pic_init_qs_minus26', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('chroma_qp_index_offset', (0, _libDataTypes.se)(v)), (0, _libCombinators.data)('deblocking_filter_control_present_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('constrained_intra_pred_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('redundant_pic_cnt_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.whenMoreData)((0, _libCombinators.list)([(0, _libCombinators.data)('transform_8x8_mode_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('pic_scaling_matrix_present_flag', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_scaling_matrix_present_flag', 1), (0, _libConditionals.each)(function (index, output) {
  return index < 6 + (output.chroma_format_Idc !== 3 ? 2 : 6) * output.transform_8x8_mode_flag;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('pic_scaling_list_present_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_scaling_list_present_flag[]', 1), _scalingList2['default'])]))), (0, _libCombinators.data)('second_chroma_qp_index_offset', (0, _libDataTypes.se)(v))])), (0, _libCombinators.verify)('pic_parameter_set')]));

exports['default'] = ppsCodec;
module.exports = exports['default'];