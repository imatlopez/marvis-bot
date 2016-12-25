'use strict';

const request = require('request');
const tokens = require('./token.js');

const get = (loc, callback) => {
  let url = 'http://api.wunderground.com/api/' + tokens.WU_TOKEN + '/condition';
  const l = loc.RESULTS[0].l;
  url += l;
  console.log('Asking WU:', url);
  request(url, (err, resp, data) => {
    if (!err && resp.statusCode === 200) {
      console.log('It is ', data);
      if (!data) {
        console.log('Error finding weather for that city.');
        callback('unknown');
      } else {
        callback(data.weather);
      }
    } else {
      console.log('Did not find weather for that city.');
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
