'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _expGolombString = require('./exp-golomb-string');

var _rbspUtils = require('./rbsp-utils');

var _mergeObj = require('./merge-obj');

/**
 * General ExpGolomb-Encoded-Structure Parse Functions
 */
var start = function start(name, parseFn) {
  return {
    decode: function decode(input, options, output) {
      var rawBitString = (0, _rbspUtils.typedArrayToBitString)(input);
      var bitString = rawBitString;

      options = options || {};
      output = output || {};

      if (!options.no_trailer_bits) {
        bitString = (0, _rbspUtils.removeRBSPTrailingBits)(rawBitString);
      }
      var expGolombDecoder = new _expGolombString.ExpGolombDecoder(bitString);

      try {
        return parseFn.decode(expGolombDecoder, output, options);
      } catch (e) {
        return e;
      }
    },
    encode: function encode(input, options) {
      var expGolombEncoder = new _expGolombString.ExpGolombEncoder();

      options = options || {};

      parseFn.encode(expGolombEncoder, input, options);

      var output = expGolombEncoder.bitReservoir;
      var bitString = (0, _rbspUtils.appendRBSPTrailingBits)(output);
      var data = (0, _rbspUtils.bitStringToTypedArray)(bitString);

      return data;
    }
  };
};

exports.start = start;
var startArray = function startArray(name, parseFn) {
  var startObj = start(name, parseFn);

  return {
    decode: function decode(input, options) {
      return startObj.decode(input, options, []);
    },
    encode: startObj.encode
  };
};

exports.startArray = startArray;
var list = function list(parseFns) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      parseFns.forEach(function (fn) {
        output = fn.decode(expGolomb, output, options, index) || output;
      });

      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      parseFns.forEach(function (fn) {
        fn.encode(expGolomb, input, options, index);
      });
    }
  };
};

exports.list = list;
var data = function data(name, dataType) {
  var nameSplit = name.split(/\[(\d*)\]/);
  var property = nameSplit[0];
  var indexOverride = undefined;
  var nameArray = undefined;

  // The `nameSplit` array can either be 1 or 3 long
  if (nameSplit && nameSplit[0] !== '') {
    if (nameSplit.length > 1) {
      nameArray = true;
      indexOverride = parseFloat(nameSplit[1]);

      if (isNaN(indexOverride)) {
        indexOverride = undefined;
      }
    }
  } else {
    throw new Error('ExpGolombError: Invalid name "' + name + '".');
  }

  return {
    name: name,
    decode: function decode(expGolomb, output, options, index) {
      var value = undefined;

      if (typeof indexOverride === 'number') {
        index = indexOverride;
      }

      value = dataType.read(expGolomb, output, options, index);

      if (!nameArray) {
        output[property] = value;
      } else {
        if (!Array.isArray(output[property])) {
          output[property] = [];
        }

        if (index !== undefined) {
          output[property][index] = value;
        } else {
          output[property].push(value);
        }
      }

      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      var value = undefined;

      if (typeof indexOverride === 'number') {
        index = indexOverride;
      }

      if (!nameArray) {
        value = input[property];
      } else if (Array.isArray(input[property])) {
        if (index !== undefined) {
          value = input[property][index];
        } else {
          value = input[property].shift();
        }
      }

      if (typeof value !== 'number') {
        return;
      }

      value = dataType.write(expGolomb, input, options, index, value);
    }
  };
};

exports.data = data;
var debug = function debug(prefix) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      console.log(prefix, expGolomb.bitReservoir, output, options, index);
    },
    encode: function encode(expGolomb, input, options, index) {
      console.log(prefix, expGolomb.bitReservoir, input, options, index);
    }
  };
};

exports.debug = debug;
var newObj = function newObj(name, parseFn) {
  var nameSplit = name.split(/\[(\d*)\]/);
  var property = nameSplit[0];
  var indexOverride = undefined;
  var nameArray = undefined;

  // The `nameSplit` array can either be 1 or 3 long
  if (nameSplit && nameSplit[0] !== '') {
    if (nameSplit.length > 1) {
      nameArray = true;
      indexOverride = parseFloat(nameSplit[1]);

      if (isNaN(indexOverride)) {
        indexOverride = undefined;
      }
    }
  } else {
    throw new Error('ExpGolombError: Invalid name "' + name + '".');
  }

  return {
    name: name,
    decode: function decode(expGolomb, output, options, index) {
      var value = undefined;

      if (typeof indexOverride === 'number') {
        index = indexOverride;
      }

      value = parseFn.decode(expGolomb, Object.create(output), options, index);

      if (!nameArray) {
        output[property] = value;
      } else {
        if (!Array.isArray(output[property])) {
          output[property] = [];
        }

        if (index !== undefined) {
          output[property][index] = value;
        } else {
          output[property].push(value);
        }
      }

      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      var value = undefined;

      if (typeof indexOverride === 'number') {
        index = indexOverride;
      }

      if (!nameArray) {
        value = input[property];
      } else if (Array.isArray(input[property])) {
        if (index !== undefined) {
          value = input[property][index];
        } else {
          value = input[property].shift();
        }
      }

      if (typeof value !== 'number') {
        return;
      }
      parseFn.encode(expGolomb, value, options, index);
    }
  };
};

exports.newObj = newObj;
var verify = function verify(name) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      var len = expGolomb.bitReservoir.length;
      if (len !== 0) {
        console.trace('ERROR: ' + name + ' was not completely parsed. There were (' + len + ') bits remaining!');
        console.log(expGolomb.originalBitReservoir);
      }
    },
    encode: function encode(expGolomb, input, options, index) {}
  };
};

exports.verify = verify;
var pickOptions = function pickOptions(property, value) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      if (typeof options[property] !== undefined) {
        //     options[property][value];
      }
    },
    encode: function encode(expGolomb, input, options, index) {
      if (typeof options[property] !== undefined) {
        //   options.values options[property][value];
      }
    }
  };
};
exports.pickOptions = pickOptions;