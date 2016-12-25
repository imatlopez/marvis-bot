'use strict';

const request = require('request');
const tokens = require('./token.js');

const get = (loc, callback) => {
  let url = 'http://api.wunderground.com/api/' + tokens.WU_TOKEN + '/condition';
  console.log('Looking up weather in', loc.RESULTS[0]);
  const l = loc.RESULTS[0].l;
  url += l;
  request(url, (err, resp, data) => {
    if (!err && resp.statusCode === 200) {
      callback(data.weather);
    } else {
      callback('unknown');
    }
  });
};

const parse = (loc, callback) => {
  request({
    uri: 'http://autocomplete.wunderground.com/aq',
    method: 'GET',
    json: true, headers: {
      'Content-Type': 'application/json'
    },
    qs: {
      query: loc
    }
  }, (err, resp, data) => {
    if (!err && resp.statusCode === 200) {
      callback(data);
    } else {
      callback(undefined);
    }
  });
};

module.exports = {
  parse: parse,
  get: get
};
