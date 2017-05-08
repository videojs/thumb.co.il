'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var when = function when(conditionFn, parseFn) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      if (conditionFn(output, options, index)) {
        return parseFn.decode(expGolomb, output, options, index);
      }

      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      if (conditionFn(input, options, index)) {
        parseFn.encode(expGolomb, input, options, index);
      }
    }
  };
};

exports.when = when;
var each = function each(conditionFn, parseFn) {
  return {
    decode: function decode(expGolomb, output, options) {
      var index = 0;

      while (conditionFn(index, output, options)) {
        parseFn.decode(expGolomb, output, options, index);
        index++;
      }

      return output;
    },
    encode: function encode(expGolomb, input, options) {
      var index = 0;

      while (conditionFn(index, input, options)) {
        parseFn.encode(expGolomb, input, options, index);
        index++;
      }
    }
  };
};

exports.each = each;
var inArray = function inArray(name, array) {
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

  return function (obj, options, index) {
    if (nameArray) {
      return obj[property] && array.indexOf(obj[property][index]) !== -1 || options[property] && array.indexOf(options[property][index]) !== -1;
    } else {
      return array.indexOf(obj[property]) !== -1 || array.indexOf(options[property]) !== -1;
    }
  };
};

exports.inArray = inArray;
var equals = function equals(name, value) {
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

  return function (obj, options, index) {
    if (nameArray) {
      return obj[property] && obj[property][index] === value || options[property] && options[property][index] === value;
    } else {
      return obj[property] === value || options[property] === value;
    }
  };
};

exports.equals = equals;
var gt = function gt(name, value) {
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

  return function (obj, options, index) {
    if (nameArray) {
      return obj[property] && obj[property][index] > value || options[property] && options[property][index] > value;
    } else {
      return obj[property] > value || options[property] > value;
    }
  };
};

exports.gt = gt;
var not = function not(fn) {
  return function (obj, options, index) {
    return !fn(obj, options, index);
  };
};

exports.not = not;
var some = function some(conditionFns) {
  return function (obj, options, index) {
    return conditionFns.some(function (fn) {
      return fn(obj, options, index);
    });
  };
};

exports.some = some;
var every = function every(conditionFns) {
  return function (obj, options, index) {
    return conditionFns.every(function (fn) {
      return fn(obj, options, index);
    });
  };
};

exports.every = every;
var whenMoreData = function whenMoreData(parseFn) {
  return {
    decode: function decode(expGolomb, output, options, index) {
      if (expGolomb.bitReservoir.length) {
        return parseFn.decode(expGolomb, output, options, index);
      }
      return output;
    },
    encode: function encode(expGolomb, input, options, index) {
      parseFn.encode(expGolomb, input, options, index);
    }
  };
};

exports.whenMoreData = whenMoreData;
var whileMoreData = function whileMoreData(parseFn) {
  return {
    decode: function decode(expGolomb, output, options) {
      var index = 0;

      while (expGolomb.bitReservoir.length) {
        parseFn.decode(expGolomb, output, options, index);
        index++;
      }

      return output;
    },
    encode: function encode(expGolomb, input, options) {
      var index = 0;
      var length = 0;

      if (Array.isArray(input)) {
        length = input.length;
      }

      while (index < length) {
        parseFn.encode(expGolomb, input, options, index);
        index++;
      }
    }
  };
};
exports.whileMoreData = whileMoreData;