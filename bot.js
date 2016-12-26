'use strict';

const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const WU = require('./weather.js');
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
      clear({ context }) {
        const id = context.fbid;
        return { fbid: id };
      },

      wuLocation({ context, entities }) {
        let location = firstEntityValue(entities, 'location');
        if (location) {
          return WU.loc(location).then((response) => {
            context.location = response.RESULTS[0].name;
            context.link = response.RESULTS[0].l;
            delete context.missingLocation;
            return context;
          }).catch((error) => {
            console.log('Weatherunderground encountered an error:', error);
            context.missingLocation = true;
            return context;
          });
        } else {
          context.missingLocation = true;
          return context;
        }
      },
      wuForecast({ context }) {
        if (context.location) {
          return WU.get(context.link).then((response) => {
            context.forecast = response.condition;
            delete context.missingForecast;
            return context;
          }).catch((error) => {
            console.log('Weatherunderground encountered an error:', error);
            context.missingForecast = true;
            return context;
          });
        } else {
          context.missingForecast = true;
          return context;
        }
      }
    }
  });
};

exports.getWit = getWit;
