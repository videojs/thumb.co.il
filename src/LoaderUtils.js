import xhr from 'xhr';
import extend from 'extend';
import {Decrypter} from 'aes-decrypter';
import ga from 'react-google-analytics';

const responseType = function(filename) {
  return /\.m3u8/i.test(filename) ? 'Text' : 'ArrayBuffer';
};

const local = function(file, callback) {
  const reader = new FileReader();

  ga('send', 'event', {
    eventCategory: 'Loader',
    eventAction: 'load-local'
  });

  reader.addEventListener('loadend', function() {
    callback({
      data: reader.result,
      name: file.name
    });
  });

  reader['readAs' + responseType(file.name)](file);
};

const decrypt = (callback, iv, encryptedData) => (error, keyData) => {
  const encrypted = new Uint8Array(encryptedData.body);
  const key = new Uint32Array(keyData.body);
  const ivCopy = new Uint32Array(iv);

  /* eslint-disable no-new, handle-callback-err */
  new Decrypter(encrypted,
                key,
                ivCopy,
                function(err, bytes) {
                  return callback(null, {
                    url: encryptedData.url,
                    body: bytes
                  });
                });
};

const fetchKey = (callback, keyInfo) => (error, segmentData) => {
  let xhrOptions = {
    method: 'GET',
    uri: keyInfo.uri,
    responseType: 'arraybuffer'
  };

  return xhr(xhrOptions, decrypt(callback, keyInfo.iv, segmentData));
}

const remote = function(options, callback) {
  const xhrOptions = extend({ method: 'GET' }, options);

  ga('send', 'event', {
    eventCategory: 'Loader',
    eventAction: 'load-remote'
  });

  xhrOptions.responseType = responseType(xhrOptions.url).toLowerCase();

  if (options.key) {
    return xhr(xhrOptions, fetchKey(callback, options.key));
  }
  return xhr(xhrOptions, callback);
}

export default {
  local,
  remote
};
