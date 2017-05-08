'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libExpGolombString = require('../../lib/exp-golomb-string');

var _libCombinators = require('../../lib/combinators');

var _libConditionals = require('../../lib/conditionals');

var _libDataTypes = require('../../lib/data-types');

var _libRbspUtils = require('../../lib/rbsp-utils');

var v = null;

var noopCodec = (0, _libCombinators.list)([]);

var initialCpbRemovalDelayLength = function initialCpbRemovalDelayLength(expGolomb, data, options, index) {
  return options.initial_cpb_removal_delay_length_minus1 + 1;
};

var cpbRemovalDelayBits = function cpbRemovalDelayBits(expGolomb, data, options, index) {
  return options.cpb_removal_delay_length_minus1 + 1;
};

var dpbOutputDelayBits = function dpbOutputDelayBits(expGolomb, data, options, index) {
  return options.dpb_output_delay_length_minus1 + 1;
};

var timeOffsetBits = function timeOffsetBits(expGolomb, data, options, index) {
  return options.time_offset_length;
};

var seiPayloadCodecs = {
  '0': {
    name: 'buffering_period',
    codec: (0, _libCombinators.list)([(0, _libCombinators.data)('seq_parameter_set_id', (0, _libDataTypes.ue)(v)), (0, _libConditionals.when)((0, _libConditionals.equals)('nal_hrd_parameters_present_flag', 1), (0, _libConditionals.each)(function (index, output, options) {
      return index <= options.cpb_cnt_minus1;
    }, (0, _libCombinators.list)([(0, _libCombinators.data)('initial_cpb_removal_delay[]', (0, _libDataTypes.u)(initialCpbRemovalDelayLength)), (0, _libCombinators.data)('initial_cpb_removal_delay_offset[]', (0, _libDataTypes.u)(initialCpbRemovalDelayLength))]))), (0, _libConditionals.when)((0, _libConditionals.equals)('vcl_hrd_parameters_present_flag', 1), (0, _libConditionals.each)(function (index, output, options) {
      return index <= options.cpb_cnt_minus1;
    }, (0, _libCombinators.list)([(0, _libCombinators.data)('initial_cpb_removal_delay[]', (0, _libDataTypes.u)(initialCpbRemovalDelayLength)), (0, _libCombinators.data)('initial_cpb_removal_delay_offset[]', (0, _libDataTypes.u)(initialCpbRemovalDelayLength))])))])
  },
  '1': {
    name: 'pic_timing',
    codec: (0, _libCombinators.list)([(0, _libConditionals.when)((0, _libConditionals.some)([(0, _libConditionals.equals)('nal_hrd_parameters_present_flag', 1), (0, _libConditionals.equals)('vcl_hrd_parameters_present_flag', 1)]), (0, _libCombinators.list)([(0, _libCombinators.data)('cpb_removal_delay', (0, _libDataTypes.u)(cpbRemovalDelayBits)), (0, _libCombinators.data)('dpb_output_delay', (0, _libDataTypes.u)(dpbOutputDelayBits))])), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct_present_flag', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('pic_struct', (0, _libDataTypes.u)(4)),

    // Interpret pic_struct
    (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 0), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(1))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 1), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(1))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 2), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(1))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 3), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(2))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 4), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(2))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 5), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(3))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 6), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(3))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 7), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(2))), (0, _libConditionals.when)((0, _libConditionals.equals)('pic_struct', 8), (0, _libCombinators.data)('NumClockTS', (0, _libDataTypes.val)(2))), (0, _libConditionals.each)(function (index, output) {
      return index < output.NumClockTS;
    }, (0, _libCombinators.list)([(0, _libCombinators.data)('clock_timestamp_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('clock_timestamp_flag[]', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('ct_type[]', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('nuit_field_based_flag[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('counting_type[]', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('full_timestamp_flag[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('discontinuity_flag[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('cnt_dropped_flag[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('n_frames[]', (0, _libDataTypes.u)(8)), (0, _libConditionals.when)((0, _libConditionals.equals)('full_timestamp_flag[]', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('seconds_value[]', (0, _libDataTypes.u)(6)), (0, _libCombinators.data)('minutes_value[]', (0, _libDataTypes.u)(6)), (0, _libCombinators.data)('hours_value[]', (0, _libDataTypes.u)(5))])), (0, _libConditionals.when)((0, _libConditionals.equals)('full_timestamp_flag[]', 0), (0, _libCombinators.list)([(0, _libCombinators.data)('seconds_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('seconds_flag[]', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('seconds_value[]', (0, _libDataTypes.u)(6)), (0, _libCombinators.data)('minutes_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('minutes_flag[]', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('minutes_value[]', (0, _libDataTypes.u)(6)), (0, _libCombinators.data)('hours_flag[]', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('hours_flag[]', 1), (0, _libCombinators.data)('hours_value[]', (0, _libDataTypes.u)(5)))]))]))])), (0, _libConditionals.when)((0, _libConditionals.gt)('time_offset_length', 0), (0, _libCombinators.data)('time_offset', (0, _libDataTypes.u)(timeOffsetBits)))]))]))]))])
  },
  '2': {
    name: 'pan_scan_rect'
  },
  '3': {
    name: 'filler_payload'
  },
  '4': {
    name: 'user_data_registered_itu_t_t35',
    codec: (0, _libCombinators.list)([(0, _libCombinators.data)('itu_t_t35_country_code', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('itu_t_t35_provider_code', (0, _libDataTypes.u)(16)), (0, _libConditionals.when)((0, _libConditionals.equals)('itu_t_t35_provider_code', 49), (0, _libCombinators.data)('ATSC_user_identifier', (0, _libDataTypes.u)(32))), (0, _libConditionals.when)((0, _libConditionals.inArray)('itu_t_t35_provider_code', [47, 49]), (0, _libCombinators.data)('ATSC1_data_user_data_type_code', (0, _libDataTypes.u)(8))), (0, _libConditionals.when)((0, _libConditionals.equals)('itu_t_t35_provider_code', 47), (0, _libCombinators.data)('DIRECTV_user_data_length', (0, _libDataTypes.u)(8))), (0, _libCombinators.data)('process_em_data_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('process_cc_data_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('additional_data_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('cc_count', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('em_data', (0, _libDataTypes.u)(8)), (0, _libConditionals.each)(function (index, output) {
      return index < output.cc_count;
    }, (0, _libCombinators.newObj)('cc_data_pkts[]', (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)('cc_data_pkt')), (0, _libCombinators.data)('marker_bits', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('cc_valid', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('cc_type', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('cc_data_1', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('cc_data_2', (0, _libDataTypes.u)(8))]))), (0, _libCombinators.data)('marker_bits', (0, _libDataTypes.u)(8))])
  },
  '5': {
    name: 'user_data_unregistered'
  },
  '6': {
    name: 'recovery_point',
    codec: (0, _libCombinators.list)([(0, _libCombinators.data)('recovery_frame_cnt', (0, _libDataTypes.ue)(v)), (0, _libCombinators.data)('exact_match_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('broken_link_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('changing_slice_group_idc', (0, _libDataTypes.u)(2))])
  },
  '7': {
    name: 'dec_ref_pic_marking_repetition'
  },
  '8': {
    name: 'spare_pic'
  },
  '9': {
    name: 'scene_info'
  },
  '10': {
    name: 'sub_seq_info'
  },
  '11': {
    name: 'sub_seq_layer_characteristics'
  },
  '12': {
    name: 'sub_seq_characteristics'
  },
  '13': {
    name: 'full_frame_freeze'
  },
  '14': {
    name: 'full_frame_freeze_release'
  },
  '15': {
    name: 'full_frame_snapshot'
  },
  '16': {
    name: 'progressive_refinement_segment_start'
  },
  '17': {
    name: 'progressive_refinement_segment_end'
  },
  '18': {
    name: 'motion_constrained_slice_group_set'
  },
  '19': {
    name: 'film_grain_characteristics'
  },
  '20': {
    name: 'deblocking_filter_display_preference'
  },
  '21': {
    name: 'stereo_video_info'
  },
  '22': {
    name: 'post_filter_hint'
  },
  '23': {
    name: 'tone_mapping_info'
  },
  '24': {
    name: 'scalability_info'
  },
  '25': {
    name: 'sub_pic_scalable_layer'
  },
  '26': {
    name: 'non_required_layer_rep'
  },
  '27': {
    name: 'priority_layer_info'
  },
  '28': {
    name: 'layers_not_present'
  },
  '29': {
    name: 'layer_dependency_change'
  },
  '30': {
    name: 'scalable_nesting'
  },
  '31': {
    name: 'base_layer_temporal_hrd'
  },
  '32': {
    name: 'quality_layer_integrity_check'
  },
  '33': {
    name: 'redundant_pic_property'
  },
  '34': {
    name: 'tl'
  },
  '35': {
    name: 'tl_switching_point'
  },
  '36': {
    name: 'parallel_decoding_info'
  },
  '37': {
    name: 'mvc_scalable_nesting'
  },
  '38': {
    name: 'view_scalability_info'
  },
  '39': {
    name: 'multiview_scene_info'
  },
  '40': {
    name: 'multiview_acquisition_info'
  },
  '41': {
    name: 'non_required_view_component'
  },
  '42': {
    name: 'view_dependency_change'
  },
  '43': {
    name: 'operation_points_not_present'
  },
  '44': {
    name: 'base_view_temporal_hrd'
  },
  '45': {
    name: 'frame_packing_arrangement'
  }
};

var seiPayloadParser = {
  decode: function decode(expGolomb, output, options, index) {
    var message = {
      payloadType: 0,
      payloadSize: 0
    };

    var payloadByte = undefined;

    do {
      payloadByte = expGolomb.readUnsignedByte();
      message.payloadType += payloadByte;
    } while (payloadByte === 255);

    do {
      payloadByte = expGolomb.readUnsignedByte();
      message.payloadSize += payloadByte;
    } while (payloadByte === 255);

    var payloadCodec = seiPayloadCodecs[message.payloadType];
    var bitString = expGolomb.readRawBits(message.payloadSize * 8);

    if (payloadCodec) {
      message.type = payloadCodec.name;

      if (payloadCodec.codec) {
        var subExpGolomb = new _libExpGolombString.ExpGolombDecoder(bitString);
        payloadCodec.codec.decode(subExpGolomb, message, options);
      } else {
        message.data = (0, _libRbspUtils.bitStringToTypedArray)(bitString);
      }
    } else {
      message.type = 'unknown type';
      message.data = (0, _libRbspUtils.bitStringToTypedArray)(bitString);
    }

    output[index] = message;

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {
    // This function was never tested...
    var message = input[index];
    var payloadTypeRemaining = message.payloadType;

    while (payloadTypeRemaining > 255) {
      payloadTypeRemaining -= 255;
      expGolomb.writeUnsignedByte(255);
    }
    expGolomb.writeUnsignedByte(payloadTypeRemaining);

    var payloadSizeRemaining = message.payloadSize;

    while (payloadSizeRemaining > 255) {
      payloadSizeRemaining -= 255;
      expGolomb.writeUnsignedByte(255);
    }
    expGolomb.writeUnsignedByte(payloadSizeRemaining);

    var payloadCodec = seiPayloadCodecs[message.payloadType];

    if (payloadCodec && payloadCodec.codec) {
      var subExpGolomb = new _libExpGolombString.ExpGolombEncoder();
      payloadCodec.codec.encode(subExpGolomb, message, options);
      var bits = subExpGolomb.bitReservoir;

      if (bits.length % 8 !== 0) {
        bits = (0, _libRbspUtils.appendRBSPTrailingBits)(bits);
      }

      expGolomb.writeRawBits(message.payloadSize * 8, bits);
    } else if (message.data) {
      expGolomb.writeRawBits(message.payloadSize * 8, (0, _libRbspUtils.typedArrayToBitString)(message.data));
    } else {
      // worse case scenario, just write 0s
      expGolomb.writeRawBits(message.payloadSize * 8, '');
    }
  }
};

/**
  * NOW we are ready to build an sei-message parser!
  */

var seiCodec = (0, _libCombinators.startArray)('sei_message', (0, _libConditionals.whileMoreData)(seiPayloadParser));

exports['default'] = seiCodec;
module.exports = exports['default'];