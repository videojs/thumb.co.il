import xhr from 'xhr';
import extend from 'extend';
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

const remote = function(options, callback) {
  const xhrOptions = extend({ method: 'GET' }, options);

  ga('send', 'event', {
    eventCategory: 'Loader',
    eventAction: 'load-remote'
  });

  xhrOptions.responseType = responseType(xhrOptions.url).toLowerCase();

  return xhr(xhrOptions, callback);
}

export default {
  local,
  remote
};
