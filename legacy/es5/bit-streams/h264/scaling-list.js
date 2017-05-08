'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var scalingList = {
  decode: function decode(expGolomb, output, options, index) {
    var lastScale = 8;
    var nextScale = 8;
    var deltaScale = undefined;
    var count = 16;
    var scalingArr = [];

    if (!Array.isArray(output.scalingList)) {
      output.scalingList = [];
    }

    if (index >= 6) {
      count = 64;
    }

    for (var j = 0; j < count; j++) {
      if (nextScale !== 0) {
        deltaScale = expGolomb.readExpGolomb();
        nextScale = (lastScale + deltaScale + 256) % 256;
      }

      scalingArr[j] = nextScale === 0 ? lastScale : nextScale;
      lastScale = scalingArr[j];
    }

    output.scalingList[index] = scalingArr;

    return output;
  },
  encode: function encode(expGolomb, input, options, index) {
    var lastScale = 8;
    var nextScale = 8;
    var deltaScale = undefined;
    var count = 16;
    var output = '';

    if (!Array.isArray(input.scalingList)) {
      return '';
    }

    if (index >= 6) {
      count = 64;
    }

    var scalingArr = output.scalingList[index];

    for (var j = 0; j < count; j++) {
      if (scalingArr[j] === lastScale) {
        output += expGolomb.writeExpGolomb(-lastScale);
        break;
      }
      nextScale = scalingArr[j] - lastScale;
      output += expGolomb.writeExpGolomb(nextScale);
      lastScale = scalingArr[j];
    }
    return output;
  }
};

exports['default'] = scalingList;
module.exports = exports['default'];