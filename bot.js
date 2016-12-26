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

  say(sessionId, context, message, callback) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    const id = context.fbid;
    if (id) {
      // Yay, we found our recipient!
      FB.message(id, message, (err, data) => {
        if (err) {
          console.log('Oops! An error occurred while forwarding the response to', id, ':', err);
        } else {
          console.log('Sending:', data);
        }
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
    }
    callback();
  },

  merge(sessionId, context, entities, message, callback) {
    const intent = getEntity(entities, 'intent');
    switch (intent) {
      case 'weather':
        const location = getEntity(entities, 'location');
        if (location) {
          context.location = location;
          delete context.missingLocation;
        } else {
          context.missingLocation = true;
        }
        break;
      default:
        console.log('No intent merged.');
    }
    callback(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  wuLocation(sessionId, context, callback) {
    if (context.location) {
      // TODO
    } else {
      context.missingLocation = true;
    }
    callback(context);
  },
  wuForecast(sessionId, context, callback) {
    if (context.location) {
      context.forecast = 'sunny';
      delete context.missingForecast;
    } else {
      context.missingForecast = true;
    }
    callback(context);
  }
};


const getWit = () => {
  return new Wit(tokens.WIT_TOKEN, actions);
};

exports.getWit = getWit;
