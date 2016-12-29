'use strict';

const request = require('request-promise');
const tokens = require('./token.js');

/**
 * Search weather using location link with API
 * @param {String} link
 * @return {Promise}
 */
const searchForecast = (link) => {
  const wuURL = 'http://api.wunderground.com/api/' + tokens.WU_TOKEN + '/';
  const API = 'conditions';
  const fullURL = wuURL + API + link + '.json';
  return request({
    uri: fullURL,
    method: 'GET'
  }).then((response) => {
    console.log('GET', fullURL);
    return JSON.parse(response);
  });
};

/**
 * Search location with API
 * @param {String} query
 * @return {Promise}
 */
const searchLocation = (query) => {
  return request({
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

/**
 * Valid location from query and link
 * @param {Object} context
 * @param {Object} entities
 * @return {Promise}
 */
const getLocation = (context, entities) => {
  const location = require('./bot.js').entity(entities, 'location');
  return searchLocation(location).then((response) => {
    context.location = response.RESULTS[0].name;
    context.link = response.RESULTS[0].l;
    delete context.missingLocation;
    return context;
  }).catch((e) => {
    context.missingLocation = e;
    return context;
  });
};

/**
 * Temperature and climate at a location
 * @param {Object} context
 * @return {Promise}
 */
const getForecast = (context) => {
  return searchForecast(context.link).then((response) => {
    context.forecast = response['current_observation'].weather.toLowerCase();
    context.temp_f = response['current_observation']['temp_f'];
    return context;
  }).catch((e) => {
    context.missingForecast = e;
    return context;
  });
};

module.exports = {
  searchLocation: searchLocation,
  searchForecast: searchForecast,
  location: getLocation,
  forecast: getForecast
};
