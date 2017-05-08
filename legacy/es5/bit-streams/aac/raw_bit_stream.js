'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _libExpGolombString = require('../../lib/exp-golomb-string');

var _libCombinators = require('../../lib/combinators');

var _libConditionals = require('../../lib/conditionals');

var _libDataTypes = require('../../lib/data-types');

var _libRbspUtils = require('../../lib/rbsp-utils');

var _scaleFactorBands = require('./scale-factor-bands');

var _codebooks = require('./codebooks');

var ONLY_LONG_SEQUENCE = 0;
var LONG_START_SEQUENCE = 1;
var EIGHT_SHORT_SEQUENCE = 2;
var LONG_STOP_SEQUENCE = 3;

var QUAD_LEN = 4;
var PAIR_LEN = 2;
var ZERO_HCB = 0;
var FIRST_PAIR_HCB = 5;
var ESC_HCB = 11;
var NOISE_HCB = 13;
var INTENSITY_HCB2 = 14;
var INTENSITY_HCB = 15;
var ESC_FLAG = 16;

var codebookInfo = [
// [unsigned, tuples, LAV]
[null, null, 0], // ZERO_HCB
[0, 4, 1], [0, 4, 1], [1, 4, 2], [1, 4, 2], [0, 2, 4], // FIRST_PAIR_HCB
[0, 2, 4], [1, 2, 7], [1, 2, 7], [1, 2, 12], [1, 2, 12], [1, 2, 16] // ESC_HCB
];

var PRED_SFB_MAX = [33, 33, 38, 40, 40, 40, 41, 41, 37, 37, 37, 34];

var bit_set = function bit_set(val, bit) {
  return 1 << bit & val;
};

var doPostIcsInfoCalculation = {
  decode: function decode(expGolomb, output, options, index) {
    var fs_index = options.sampling_frequency_index;

    if (output.window_sequence === EIGHT_SHORT_SEQUENCE) {
      output.num_windows = 8;
      output.num_window_groups = 1;
      output.window_group_length = [1];
      output.num_swb = _scaleFactorBands.swb_offset_long_window[fs_index].length - 1;
      output.sect_sfb_offset = [];
      output.swb_offset = [];

      for (var i = 0; i <= output.num_swb; i++) {
        output.swb_offset[i] = _scaleFactorBands.swb_offset_short_window[fs_index][i];
      }

      for (var i = 0; i < output.num_windows - 1; i++) {
        if (bit_set(output.scale_factor_grouping, 6 - i) === 0) {
          output.num_window_groups += 1;
          output.window_group_length[output.num_window_groups - 1] = 1;
        } else {
          output.window_group_length[output.num_window_groups - 1] += 1;
        }
      }

      /* preparation of sect_sfb_offset for short blocks */
      for (var g = 0; g < output.num_window_groups; g++) {
        var sect_sfb = 0;
        var offset = 0;
        output.sect_sfb_offset[g] = [];
        for (var i = 0; i < output.max_sfb; i++) {
          var width = _scaleFactorBands.swb_offset_short_window[fs_index][i + 1] - _scaleFactorBands.swb_offset_short_window[fs_index][i];
          width *= output.window_group_length[g];
          output.sect_sfb_offset[g][sect_sfb++] = offset;
          offset += width;
        }
        output.sect_sfb_offset[g][sect_sfb] = offset;
      }
    } else {
      output.num_windows = 1;
      output.num_window_groups = 1;
      output.window_group_length = [1];
      output.num_swb = _scaleFactorBands.swb_offset_long_window[fs_index].length - 1;
      output.sect_sfb_offset = [[]];
      output.swb_offset = [];

      for (var i = 0; i <= output.max_sfb; i++) {
        output.sect_sfb_offset[0][i] = _scaleFactorBands.swb_offset_long_window[fs_index][i];
        output.swb_offset[i] = _scaleFactorBands.swb_offset_long_window[fs_index][i];
      }
    }

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {}
};

var sectionData = {
  decode: function decode(expGolomb, output, options, index) {
    var bits = 5;
    if (output.window_sequence === EIGHT_SHORT_SEQUENCE) {
      bits = 3;
    }

    var sect_esc_val = (1 << bits) - 1;
    output.sect_cb = [];
    output.sect_start = [];
    output.sect_end = [];
    output.sfb_cb = [];
    output.num_sec = [];
    for (var g = 0; g < output.num_window_groups; g++) {
      var k = 0;
      var i = 0;

      output.sect_cb[g] = [];
      output.sect_start[g] = [];
      output.sect_end[g] = [];
      output.sfb_cb[g] = [];

      while (k < output.max_sfb) {
        output.sect_cb[g][i] = expGolomb.readBits(4);
        var sect_len = 0;
        var sect_len_part = 0;

        do {
          sect_len_part = expGolomb.readBits(bits);
          sect_len += sect_len_part;
        } while (sect_len_part === sect_esc_val);

        output.sect_start[g][i] = k;
        output.sect_end[g][i] = k + sect_len;
        for (var sfb = k; sfb < k + sect_len; sfb++) {
          output.sfb_cb[g][sfb] = output.sect_cb[g][i];
        }
        k += sect_len;
        i++;
      }
      output.num_sec[g] = i;
    }

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {}
};

var scaleFactorData = {
  decode: function decode(expGolomb, output, options, index) {
    output.scale_factors = [];

    for (var g = 0; g < output.num_window_groups; g++) {
      for (var sfb = 0; sfb < output.max_sfb; sfb++) {
        if (output.sfb_cb[g][sfb] !== ZERO_HCB) {
          output.scale_factors.push((0, _codebooks.readCodebookValue)(_codebooks.scaleFactorCB, expGolomb));
        }
      }
    }
    return output;
  },
  encode: function encode(expGolomb, input, options, index) {}
};

var tnsData = {
  decode: function decode(expGolomb, output, options, index) {
    output.n_filt = [];
    output.coef_res = [];
    output.length = [];
    output.order = [];
    output.direction = [];
    output.coef_compress = [];
    output.coef = [];

    for (var w = 0; w < output.num_windows; w++) {
      output.n_filt[w] = expGolomb.readBits(2);
      output.length[w] = [];
      output.order[w] = [];
      output.direction[w] = [];
      output.coef_compress[w] = [];
      output.coef[w] = [];

      if (output.n_filt[w]) {
        output.coef_res[w] = expGolomb.readBits(1);
      }

      for (var filt = 0; filt < output.n_filt[w]; filt++) {
        output.length[w][filt] = expGolomb.readBits(6);
        output.order[w][filt] = expGolomb.readBits(5);
        if (output.order[w][filt]) {
          output.direction[w][filt] = expGolomb.readBits(1);
          output.coef_compress[w][filt] = expGolomb.readBits(1);
          output.coef[w][filt] = [];
          for (var i = 0; i < output.order[w][filt]; i++) {
            output.coef[w][filt][i] = expGolomb.readBits(output.coef_res[w] + 3);
          }
        }
      }
    }

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {}
};

var gainControlData = {
  decode: function decode(expGolomb, output, options, index) {
    output.max_band = expGolomb.readBits(2);
    output.adjust_num = [];
    output.alevcode = [];
    output.aloccode = [];

    if (output.window_sequence === ONLY_LONG_SEQUENCE) {
      for (var bd = 1; bd <= output.max_band; bd++) {
        output.adjust_num[bd] = [];
        output.alevcode[bd] = [];
        output.aloccode[bd] = [];
        for (var wd = 0; wd < 1; wd++) {
          output.adjust_num[bd][wd] = expGolomb.readBits(3);
          output.alevcode[bd][wd] = [];
          output.aloccode[bd][wd] = [];
          for (var ad = 0; ad < output.adjust_num[bd][wd]; ad++) {
            output.alevcode[bd][wd][ad] = expGolomb.readBits(4);
            output.aloccode[bd][wd][ad] = expGolomb.readBits(5);
          }
        }
      }
    } else if (output.window_sequence === LONG_START_SEQUENCE) {
      for (var bd = 1; bd <= output.max_band; bd++) {
        output.adjust_num[bd] = [];
        output.alevcode[bd] = [];
        output.aloccode[bd] = [];
        for (var wd = 0; wd < 2; wd++) {
          output.adjust_num[bd][wd] = expGolomb.readBits(3);
          output.alevcode[bd][wd] = [];
          output.aloccode[bd][wd] = [];
          for (var ad = 0; ad < output.adjust_num[bd][wd]; ad++) {
            output.alevcode[bd][wd][ad] = expGolomb.readBits(4);

            if (wd === 0) {
              output.aloccode[bd][wd][ad] = expGolomb.readBits(4);
            } else {
              output.aloccode[bd][wd][ad] = expGolomb.readBits(2);
            }
          }
        }
      }
    } else if (output.window_sequence === EIGHT_SHORT_SEQUENCE) {
      for (var bd = 1; bd <= output.max_band; bd++) {
        output.adjust_num[bd] = [];
        output.alevcode[bd] = [];
        output.aloccode[bd] = [];
        for (var wd = 0; wd < 8; wd++) {
          output.adjust_num[bd][wd] = expGolomb.readBits(3);
          output.alevcode[bd][wd] = [];
          output.aloccode[bd][wd] = [];
          for (var ad = 0; ad < output.adjust_num[bd][wd]; ad++) {
            output.alevcode[bd][wd][ad] = expGolomb.readBits(4);
            output.aloccode[bd][wd][ad] = expGolomb.readBits(2);
          }
        }
      }
    } else if (output.window_sequence === LONG_STOP_SEQUENCE) {
      for (var bd = 1; bd <= output.max_band; bd++) {
        output.adjust_num[bd] = [];
        output.alevcode[bd] = [];
        output.aloccode[bd] = [];
        for (var wd = 0; wd < 2; wd++) {
          output.adjust_num[bd][wd] = expGolomb.readBits(3);
          output.alevcode[bd][wd] = [];
          output.aloccode[bd][wd] = [];
          for (var ad = 0; ad < output.adjust_num[bd][wd]; ad++) {
            output.alevcode[bd][wd][ad] = expGolomb.readBits(4);

            if (wd === 0) {
              output.aloccode[bd][wd][ad] = expGolomb.readBits(4);
            } else {
              output.aloccode[bd][wd][ad] = expGolomb.readBits(5);
            }
          }
        }
      }
    }
  },
  encode: function encode(expGolomb, input, options, index) {}
};

var decodeHCode = function decodeHCode(idx, sect_cb) {
  var _codebookInfo$sect_cb = _slicedToArray(codebookInfo[sect_cb], 3);

  var unsigned = _codebookInfo$sect_cb[0];
  var dim = _codebookInfo$sect_cb[1];
  var lav = _codebookInfo$sect_cb[2];

  var mod = undefined,
      off = undefined;
  var v = undefined;
  var vals = [];

  if (unsigned) {
    mod = lav + 1;
    off = 0;
  } else {
    mod = 2 * lav + 1;
    off = lav;
  }

  if (dim === 4) {
    vals.push(v = parseInt(idx / (mod * mod * mod)) - off);
    idx -= (v + off) * (mod * mod * mod);
    vals.push(v = parseInt(idx / (mod * mod)) - off);
    idx -= (v + off) * (mod * mod);
    vals.push(v = parseInt(idx / mod) - off);
    idx -= (v + off) * mod;
    vals.push(idx - off);
  } else {
    vals.push(v = parseInt(idx / mod) - off);
    idx -= (v + off) * mod;
    vals.push(idx - off);
  }
  return vals;
};

var getSignBits = function getSignBits(vals, sect_cb) {
  var _codebookInfo$sect_cb2 = _slicedToArray(codebookInfo[sect_cb], 1);

  var unsigned = _codebookInfo$sect_cb2[0];

  if (!unsigned) {
    return 0;
  } else {
    return vals.filter(function (v) {
      return v !== 0;
    }).length;
  }
};

var readEscValue = function readEscValue(expGolomb) {
  var bits = expGolomb.bitReservoir;
  var N = 0;

  for (N = 0; N < bits.length; N++) {
    if (bits[N] === '0') {
      var esc = expGolomb.readBits(N + 1);
      var _val = expGolomb.readBits(N + 4);

      return Math.pow(2, N + 4) + _val;
    }
  }
};

var spectralData = {
  decode: function decode(expGolomb, output, options, index) {
    output.spectral_data = [];
    for (var g = 0; g < output.num_window_groups; g++) {
      output.spectral_data[g] = [];
      for (var i = 0; i < output.num_sec[g]; i++) {
        var sect_cb = output.sect_cb[g][i];
        var start_k = output.sect_sfb_offset[g][output.sect_start[g][i]];
        var end_k = output.sect_sfb_offset[g][output.sect_end[g][i]];

        if (sect_cb !== ZERO_HCB && sect_cb <= ESC_HCB) {
          for (var k = start_k; k < end_k;) {
            var idx = (0, _codebooks.readCodebookValue)(_codebooks.spectrumCB[sect_cb], expGolomb);
            var vals = decodeHCode(idx, sect_cb);
            var numBits = getSignBits(vals, sect_cb);

            // Read sign bits
            var bits = expGolomb.readRawBits(numBits);

            output.spectral_data[g][k] = vals[0];
            output.spectral_data[g][k + 1] = vals[1];
            if (sect_cb < FIRST_PAIR_HCB) {
              output.spectral_data[g][k + 2] = vals[2];
              output.spectral_data[g][k + 3] = vals[3];
              k += QUAD_LEN;
            } else {
              if (sect_cb === ESC_HCB) {
                if (vals[0] === ESC_FLAG) {
                  output.spectral_data[g][k] = readEscValue(expGolomb);
                }
                if (vals[1] === ESC_FLAG) {
                  output.spectral_data[g][k + 1] = readEscValue(expGolomb);
                }
              }
              k += PAIR_LEN;
            }
          }
        }
      }
    }

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {}
};

var readMsMask = {
  decode: function decode(expGolomb, output, options, index) {
    output.ms_used = [];

    for (var g = 0; g < output.num_window_groups; g++) {
      output.ms_used[g] = [];
      for (var sfb = 0; sfb < output.max_sfb; sfb++) {
        output.ms_used[g][sfb] = expGolomb.readBits(1);
      }
    }

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {}
};

var icsInfo = (0, _libCombinators.list)([(0, _libCombinators.data)('ics_reserved_bit', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('window_sequence', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('window_shape', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('window_sequence', EIGHT_SHORT_SEQUENCE), (0, _libCombinators.list)([(0, _libCombinators.data)('max_sfb', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('scale_factor_grouping', (0, _libDataTypes.u)(7))])), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('window_sequence', EIGHT_SHORT_SEQUENCE)), (0, _libCombinators.list)([(0, _libCombinators.data)('max_sfb', (0, _libDataTypes.u)(6)), (0, _libCombinators.data)('predictor_data_present', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('predictor_data_present', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('predictor_reset', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('predictor_reset', 1), (0, _libCombinators.data)('predictor_reset_group_number', (0, _libDataTypes.u)(5))), (0, _libConditionals.each)(function (index, options) {
  return index < Math.min(options.max_sfb, PRED_SFB_MAX[options.sampling_frequency_index]);
}, (0, _libCombinators.data)('prediction_used[]', (0, _libDataTypes.u)(1)))]))])), doPostIcsInfoCalculation]);

var pulseData = (0, _libCombinators.list)([(0, _libCombinators.data)('number_pulse', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('pulse_start_sfb', (0, _libDataTypes.u)(6)), (0, _libConditionals.each)(function (index, options) {
  return index <= options.number_pulse;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('pulse_offset[]', (0, _libDataTypes.u)(5)), (0, _libCombinators.data)('pulse_amp[]', (0, _libDataTypes.u)(4))]))]);

var individualChannelStream = (0, _libCombinators.list)([(0, _libCombinators.data)('global_gain', (0, _libDataTypes.u)(8)), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('common_window', 1)), icsInfo), sectionData, scaleFactorData, (0, _libCombinators.data)('pulse_data_present', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('pulse_data_present', 1), pulseData), (0, _libCombinators.data)('tns_data_present', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('tns_data_present', 1), tnsData), (0, _libCombinators.data)('gain_control_data_present', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('gain_control_data_present', 1), gainControlData), spectralData]);

var noop = { decode: function decode() {} };

var elemTypes = ['single_channel_element', 'channel_pair_element', 'coupling_channel_element', 'lfe_channel_element', 'data_stream_element', 'program_config_element', 'fill_element', 'end'];

var elemParsers = [(0, _libCombinators.list)([// single_channel_element
(0, _libCombinators.data)('element_instance_tag', (0, _libDataTypes.u)(4)), individualChannelStream]), (0, _libCombinators.list)([// channel_pair_element
(0, _libCombinators.data)('element_instance_tag', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('common_window', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('common_window', 1), (0, _libCombinators.list)([icsInfo, (0, _libCombinators.data)('ms_mask_present', (0, _libDataTypes.u)(2)), (0, _libConditionals.when)((0, _libConditionals.equals)('ms_mask_present', 1), readMsMask)])), (0, _libCombinators.newObj)('ics_1', (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)('individual_channel_stream')), individualChannelStream])), (0, _libCombinators.newObj)('ics_2', (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)('individual_channel_stream')), individualChannelStream]))]), noop, // coupling_channel_element
(0, _libCombinators.list)([// lfe_channel_element
(0, _libCombinators.data)('element_instance_tag', (0, _libDataTypes.u)(4)), individualChannelStream]), (0, _libCombinators.list)([// data_stream_element
(0, _libCombinators.data)('element_instance_tag', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('data_byte_align_flag', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('count', (0, _libDataTypes.u)(8)), (0, _libCombinators.data)('esc_count', (0, _libDataTypes.val)(0)), (0, _libConditionals.when)((0, _libConditionals.equals)('count', 255), (0, _libCombinators.data)('esc_count', (0, _libDataTypes.u)(8))), (0, _libConditionals.when)((0, _libConditionals.equals)('data_byte_align_flag', 1), (0, _libCombinators.data)('byte_alignment_bits', _libDataTypes.byteAlign)), (0, _libConditionals.each)(function (index, options) {
  return index < options.count + options.esc_count;
}, (0, _libCombinators.data)('data_stream_byte[]', (0, _libDataTypes.u)(8)))]), (0, _libCombinators.list)([// program_config_element
(0, _libCombinators.data)('element_instance_tag', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('profile', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('sampling_frequency_index', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('num_front_channel_elements', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('num_side_channel_elements', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('num_back_channel_elements', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('num_lfe_channel_elements', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('num_assoc_data_elements', (0, _libDataTypes.u)(3)), (0, _libCombinators.data)('num_valid_cc_elements', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('mono_mixdown_present', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('mono_mixdown_present', 1), (0, _libCombinators.data)('mono_mixdown_element_number', (0, _libDataTypes.u)(4))), (0, _libCombinators.data)('stereo_mixdown_present', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('stereo_mixdown_present', 1), (0, _libCombinators.data)('stereo_mixdown_element_number', (0, _libDataTypes.u)(4))), (0, _libCombinators.data)('matrix_mixdown_idx_present', (0, _libDataTypes.u)(1)), (0, _libConditionals.when)((0, _libConditionals.equals)('matrix_mixdown_idx_present', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('matrix_mixdown_idx', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('pseudo_surround_enable', (0, _libDataTypes.u)(1))])), (0, _libConditionals.each)(function (index, options) {
  return index < options.num_front_channel_elements;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('front_element_is_cpe[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('front_element_tag_select[]', (0, _libDataTypes.u)(4))])), (0, _libConditionals.each)(function (index, options) {
  return index < options.num_side_channel_elements;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('side_element_is_cpe[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('side_element_tag_select[]', (0, _libDataTypes.u)(4))])), (0, _libConditionals.each)(function (index, options) {
  return index < options.num_back_channel_elements;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('back_element_is_cpe[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('back_element_tag_select[]', (0, _libDataTypes.u)(4))])), (0, _libConditionals.each)(function (index, options) {
  return index < options.num_lfe_channel_elements;
}, (0, _libCombinators.data)('lfe_element_tag_select[]', (0, _libDataTypes.u)(4))), (0, _libConditionals.each)(function (index, options) {
  return index < options.num_assoc_data_elements;
}, (0, _libCombinators.data)('assoc_data_element_tag_select[]', (0, _libDataTypes.u)(4))), (0, _libConditionals.each)(function (index, options) {
  return index < options.num_valid_cc_elements;
}, (0, _libCombinators.list)([(0, _libCombinators.data)('cc_element_is_ind_sw[]', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('valid_cc_element_tag_select[]', (0, _libDataTypes.u)(4))])), (0, _libCombinators.data)('byte_alignment_bits', (0, _libDataTypes.byteAlign)()), (0, _libCombinators.data)('comment_field_bytes', (0, _libDataTypes.u)(8)), (0, _libConditionals.each)(function (index, options) {
  return index < options.comment_field_bytes;
}, (0, _libCombinators.data)('comment_field_data[]', (0, _libDataTypes.u)(8)))]), (0, _libCombinators.list)([// fill_element
(0, _libCombinators.data)('count', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('esc_count', (0, _libDataTypes.val)(0)), (0, _libConditionals.when)((0, _libConditionals.equals)('count', 15), (0, _libCombinators.data)('esc_count', (0, _libDataTypes.u)(8))), (0, _libConditionals.each)(function (index, options) {
  return index < options.count + options.esc_count - 1;
}, (0, _libCombinators.data)('fill_byte[]', (0, _libDataTypes.u)(8)))]), (0, _libCombinators.list)([// end
(0, _libCombinators.data)('byte_alignment_bits', (0, _libDataTypes.byteAlign)())])];

var aacCodec = (0, _libCombinators.start)('elements', (0, _libConditionals.whileMoreData)((0, _libCombinators.newObj)('elements[]', (0, _libCombinators.list)([(0, _libCombinators.data)('id_syn_ele', (0, _libDataTypes.u)(3)), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 0), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[0])), elemParsers[0]])), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 1), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[1])), elemParsers[1]])), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 2), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[2])), elemParsers[2]])), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 3), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[3])), elemParsers[3]])), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 4), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[4])), elemParsers[4]])), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 5), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[5])), elemParsers[5]])), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 6), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[6])), elemParsers[6]])), (0, _libConditionals.when)((0, _libConditionals.equals)('id_syn_ele', 7), (0, _libCombinators.list)([(0, _libCombinators.data)('type', (0, _libDataTypes.val)(elemTypes[7])), elemParsers[7]]))]))));

exports.aacCodec = aacCodec;
var adts_error_check = (0, _libConditionals.when)((0, _libConditionals.equals)('protection_absent', 0), (0, _libCombinators.data)('crc_check', (0, _libDataTypes.u)(16)));

var adts_header_error_check = (0, _libCombinators.list)([(0, _libConditionals.when)((0, _libConditionals.equals)('protection_absent', 0), (0, _libConditionals.each)(function (index, options, output) {
  return index < output.number_of_raw_data_blocks_in_frame;
}, (0, _libCombinators.data)('raw_data_block_position[]', (0, _libDataTypes.u)(16)))), adts_error_check]);

var adtsCodec = (0, _libCombinators.start)('adts_frame', (0, _libCombinators.list)([(0, _libCombinators.data)('sync_word', (0, _libDataTypes.u)(12)), (0, _libCombinators.data)('ID', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('layer', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('protection_absent', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('profile', (0, _libDataTypes.u)(2)), (0, _libCombinators.data)('sampling_frequency_index', (0, _libDataTypes.u)(4)), (0, _libCombinators.data)('private_bit', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('channel_configuration', (0, _libDataTypes.u)(3)), (0, _libCombinators.data)('original_copy', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('home', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('copyright_identification_bit', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('copyright_identification_start', (0, _libDataTypes.u)(1)), (0, _libCombinators.data)('aac_frame_length', (0, _libDataTypes.u)(13)), (0, _libCombinators.data)('adts_buffer_fullness', (0, _libDataTypes.u)(11)), (0, _libCombinators.data)('number_of_raw_data_blocks_in_frame', (0, _libDataTypes.u)(2)), (0, _libConditionals.when)((0, _libConditionals.equals)('number_of_raw_data_blocks_in_frame', 0), (0, _libCombinators.list)([adts_error_check, aacCodec])), (0, _libConditionals.when)((0, _libConditionals.not)((0, _libConditionals.equals)('number_of_raw_data_blocks_in_frame', 0)), (0, _libCombinators.list)([adts_header_error_check, (0, _libConditionals.each)(function (index, options, output) {
  return index <= output.number_of_raw_data_blocks_in_frame;
}, (0, _libCombinators.list)([(0, _libCombinators.newObj)('frames[]', aacCodec), adts_error_check]))]))]));
exports.adtsCodec = adtsCodec;