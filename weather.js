'use strict';

const tokens = require('./token.js');
const rp = require('request-promise');

const get = (location) => {
  const wuURL = 'http://api.wunderground.com/api/' + tokens.WU_TOKEN + '/';
  const API = 'geolookup/condition/q/';
  const fullURL = wuURL + API + encodeURIComponent(location) + '.json';
  return rp({
    uri: fullURL,
    method: 'GET'
  }).then((response) => Promise.all([response.json(), response.status]));
};

const location = (query) => {
  const acURL = 'http://autocomplete.wunderground.com/aq';
  const qs = '?=query' + query;
  const fullURL = acURL + qs;
  return rp({
    uri: fullURL,
    method: 'GET'
  });
};

module.exports = {
  loc: location,
  get: get
};
