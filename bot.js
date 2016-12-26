'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
// const WU = require('./weather.js');
const tokens = require('./token.js');

const getEntity = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  send(request, response) {
    console.log('user said...', JSON.stringify(request));
    console.log('sending...', JSON.stringify(response));
  },

  getForecast(request) {
    let { entities, context } = request;
    let location = getEntity(entities, 'location');
    if (location) {
      context.location = location;
      context.forecast = 'sunny';
      delete context.missingLocation;
    } else {
      context.missingLocation = true;
      delete context.forecast;
    }
    return context;
  }
};


const getWit = () => {
  return new Wit(tokens.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log('Bot testing mode.');
  const client = getWit();
  client.interactive();
}
