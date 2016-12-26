'use strict';

const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
// const WU = require('./weather.js');
const tokens = require('./token.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const getWit = () => {
  return new Wit({
    accessToken: tokens.WIT_TOKEN,
    actions: {

      send({ context }, { text }) {
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
      },
      done({ context }) {
        const id = context.fbid;
        return { fbid: id };
      },

      wuLocation({ context, entities }) {
        let location = firstEntityValue(entities, 'location');
        if (location) {
          context.location = location;
          delete context.missingLocation;
        } else {
          context.missingLocation = true;
        }
        return context;
      },
      wuForecast({ context }) {
        if (context.location) {
          context.forecast = 'sunny';
          delete context.missingForecast;
        } else {
          context.missingForecast = true;
        }
        return context;
      }
    }
  });
};

exports.getWit = getWit;
