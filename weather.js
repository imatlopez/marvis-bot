'use strict';

const tokens = require('./token.js');
const rp = require('request-promise');

const get = (link) => {
  const wuURL = 'http://api.wunderground.com/api/' + tokens.WU_TOKEN + '/';
  const API = 'conditions';
  const fullURL = wuURL + API + link + '.json';
  return rp({
    uri: fullURL,
    method: 'GET'
  }).then((response) => {
    console.log('GET', fullURL);
    return JSON.parse(response);
  });
};

const location = (query) => {
  return rp({
    uri: 'http://autocomplete.wunderground.com/aq',
    method: 'GET',
    qs: {
      query: query
    }
  }).then((response) => {
    console.log(
      'GET',
      'http://autocomplete.wunderground.com/aq?query=' + encodeURIComponent(query)
    );
    return JSON.parse(response);
  });
};

module.exports = {
  loc: location,
  get: get
};
