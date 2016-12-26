'use strict';

const tokens = require('./token.js');
const rp = require('request-promise');

const get = (link) => {
  const wuURL = 'http://api.wunderground.com/api/' + tokens.WU_TOKEN + '/';
  const API = 'condition';
  const fullURL = wuURL + API + link;
  return rp({
    uri: fullURL,
    method: 'GET'
  });
};

const location = (query) => {
  return rp({
    uri: 'http://autocomplete.wunderground.com/aq',
    method: 'GET',
    qs: {
      query: query
    }
  });
};

module.exports = {
  loc: location,
  get: get
};
