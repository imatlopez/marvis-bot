'use strict';

const request = require('request');
const tokens = require('./token.js');

const get = (loc, callback) => {
  let url = 'http://api.wunderground.com/api/' + tokens.WU_TOKEN + '/condition' + loc;
  return request(url, (err, resp, data) => {
    if (err) {
      callback(err || data.error && data.error.message, data);
    }
  });
};

const parse = request.defaults({
  uri: 'http://autocomplete.wunderground.com/aq',
  method: 'GET',
  json: true, headers: {
    'Content-Type': 'application/json'
  }
});

module.exports = {
  parse: parse,
  get: get
};
