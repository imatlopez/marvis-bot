'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
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

  say(request) {
    let { context, text } = request;
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    const id = context.fbid;
    if (id) {
      // Yay, we found our recipient!
      FB.message(id, text, (err, data) => {
        if (err) {
          console.log('Oops! An error occurred while forwarding the response to', id, ':', err);
        } else {
          console.log('Sending:', data);
        }
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
    }
    return context;
  },

  wuLocation(request) {
    let { entities, context } = request;
    let location = getEntity(entities, 'location');
    if (location) {
      context.location = location;
      delete context.missingLocation;
    } else {
      context.missingLocation = true;
    }
    return context;
  },
  wuForecast(request) {
    let { context } = request;
    if (context.location) {
      context.forecast = 'sunny';
      delete context.missingForecast;
    } else {
      context.missingForecast = true;
    }
    return context;
  }
};


const getWit = () => {
  return new Wit(tokens.WIT_TOKEN, actions);
};

exports.getWit = getWit;
