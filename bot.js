'use strict';

const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const FBM = require('./messenger.js');
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
        const id = context.psid;
        if (id) {
          // Yay, we found our recipient!
          FBM.message(id, text, (err, data) => {
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
        context.clearing = true;
        return undefined;
      },
      nop({ context }) {
        return context;
      },

      fbName({ context }) {
        // Finding user's first name
        return FB.user(context.psid).then((response) => {
          const name = response['first_name'];
          if (name) {
            context.name = name;
            delete context.noName;
          } else {
            console.log('Unable to get name from response:', response);
            context.noName = true;
          }
          return context;
        }).catch((e) => {
          console.log('Error getting name for', context.psid, ':', e);
          context.noName = true;
          return context;
        });

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
        if (context.link) {
          return WU.get(context.link).then((response) => {
            if (response['current_observation']) {
              console.log('Forecast:', response['current_observation'].weather);
              console.log('Temp:', response['current_observation']['temp_f']);
              context.forecast = response['current_observation'].weather.toLowerCase();
              context.temp_f = response['current_observation']['temp_f'];
            } else {
              console.log('Error: WU returned\n', response);
              delete context.missingForecast;
            }
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
