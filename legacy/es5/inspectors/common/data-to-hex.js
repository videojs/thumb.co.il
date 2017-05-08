'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var dataToHex = function dataToHex(value, indent) {
  var bytesAsArray = Array.prototype.slice.call(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
  // print out raw bytes as hexademical
  var ascii = bytesAsArray.reduce(groupBy(16), []).map(function (line) {
    return line.map(function (byte) {
      return byte <= 31 || byte >= 127 && byte <= 159 ? '.' : String.fromCharCode(byte);
    }).map(function (char) {
      return char === '&' ? '&amp;' : char === '<' ? '&lt;' : char;
    });
  }).map(function (a) {
    return a.join('');
  });
  /*      .join('')
        .match(/.{1,48}/g);*/

  var bytes = bytesAsArray.map(function (byte) {
    return ('00' + byte.toString(16)).slice(-2);
  }).reduce(groupBy(8), []) // form arrays of 8-bytes each
  .reduce(groupBy(2), []) // create arrays of pairs of 8-byte arrays
  .map(function (a) {
    return a.map(function (a) {
      return a.join(' ');
    }).join('  ');
  }); // Stringify
  /*      .join('')
        .match(/.{1,48}/g);*/

  if (!bytes) {
    return '<>';
  }

  return bytes.map(function (line, index) {
    var hexSide = indent + line;

    // Pad so that the remaining line length is 70 (= 48 + 6 + 16) for hex, pad, ascii
    while (hexSide.length < 54) hexSide += ' ';

    return hexSide + ascii[index];
  }).join('\n');
};

var groupBy = function groupBy(count) {
  return function (p, c) {
    var last = p.pop();

    if (!last) {
      last = [];
    } else if (last.length === count) {
      p.push(last);
      last = [];
    }
    last.push(c);
    p.push(last);
    return p;
  };
};

exports['default'] = dataToHex;
module.exports = exports['default'];