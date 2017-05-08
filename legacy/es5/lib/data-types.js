'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var getNumBits = function getNumBits(numBits, expGolomb, data, options, index) {
  if (typeof numBits === 'function') {
    return numBits(expGolomb, data, options, index);
  }
  return numBits;
};

var dataTypes = {
  u: function u(numBits) {
    return {
      read: function read(expGolomb, output, options, index) {
        var bitsToRead = getNumBits(numBits, expGolomb, output, options, index);

        return expGolomb.readBits(bitsToRead);
      },
      write: function write(expGolomb, input, options, index, value) {
        var bitsToWrite = getNumBits(numBits, expGolomb, input, options, index);

        expGolomb.writeBits(bitsToWrite, value);
      }
    };
  },
  f: function f(numBits) {
    return {
      read: function read(expGolomb, output, options, index) {
        var bitsToRead = getNumBits(numBits, expGolomb, output, options, index);

        return expGolomb.readBits(bitsToRead);
      },
      write: function write(expGolomb, input, options, index, value) {
        var bitsToWrite = getNumBits(numBits, expGolomb, input, options, index);

        expGolomb.writeBits(bitsToWrite, value);
      }
    };
  },
  ue: function ue() {
    return {
      read: function read(expGolomb, output, options, index) {
        return expGolomb.readUnsignedExpGolomb();
      },
      write: function write(expGolomb, input, options, index, value) {
        expGolomb.writeUnsignedExpGolomb(value);
      }
    };
  },
  se: function se() {
    return {
      read: function read(expGolomb, output, options, index) {
        return expGolomb.readExpGolomb();
      },
      write: function write(expGolomb, input, options, index, value) {
        expGolomb.writeExpGolomb(value);
      }
    };
  },
  b: function b() {
    return {
      read: function read(expGolomb, output, options, index) {
        return expGolomb.readUnsignedByte();
      },
      write: function write(expGolomb, input, options, index, value) {
        expGolomb.writeUnsignedByte(value);
      }
    };
  },
  val: function val(_val) {
    return {
      read: function read(expGolomb, output, options, index) {
        if (typeof _val === 'function') {
          return _val(expGolomb, output, options, index);
        }
        return _val;
      },
      write: function write(expGolomb, input, options, index, value) {
        if (typeof _val === 'function') {
          _val(ExpGolomb, output, options, index);
        }
      }
    };
  },
  byteAlign: function byteAlign() {
    return {
      read: function read(expGolomb, output, options, index) {
        return expGolomb.byteAlign();
      },
      write: function write(expGolomb, input, options, index, value) {}
    };
  }
};

exports['default'] = dataTypes;
module.exports = exports['default'];