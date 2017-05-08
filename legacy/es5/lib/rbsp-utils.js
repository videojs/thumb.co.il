'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var typedArrayToBitString = function typedArrayToBitString(data) {
  var array = [];
  var bytesPerElement = data.BYTES_PER_ELEMENT || 1;
  var prefixZeros = '';

  for (var i = 0; i < data.length; i++) {
    array.push(data[i]);
  }

  for (var i = 0; i < bytesPerElement; i++) {
    prefixZeros += '00000000';
  }

  return array.map(function (n) {
    return (prefixZeros + n.toString(2)).slice(-bytesPerElement * 8);
  }).join('');
};

exports.typedArrayToBitString = typedArrayToBitString;
var bitStringToTypedArray = function bitStringToTypedArray(bitString) {
  var bitsNeeded = 8 - bitString.length % 8;

  // Pad with zeros to make length a multiple of 8
  for (var i = 0; bitsNeeded !== 8 && i < bitsNeeded; i++) {
    bitString += '0';
  }

  var outputArray = bitString.match(/(.{8})/g);
  var numberArray = outputArray.map(function (n) {
    return parseInt(n, 2);
  });

  return new Uint8Array(numberArray);
};

exports.bitStringToTypedArray = bitStringToTypedArray;
var removeRBSPTrailingBits = function removeRBSPTrailingBits(bits) {
  return bits.split(/10*$/)[0];
};

exports.removeRBSPTrailingBits = removeRBSPTrailingBits;
var appendRBSPTrailingBits = function appendRBSPTrailingBits(bits) {
  var bitString = bits + '10000000';
  var sliceAmount = bitString.length % 8;

  if (sliceAmount === 0) {
    return bitString;
  } else {
    return bitString.slice(0, -sliceAmount);
  }
};
exports.appendRBSPTrailingBits = appendRBSPTrailingBits;