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
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

/*
  Overhead Actions
*/
const send = (context, text) => {
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
};
const clear = (context) => {
  context.clearing = true;
  return null;
};
const nop = (context) => {
  return context;
};
const merge = (context, entities) => {
  const feeling = firstEntityValue(entities, 'feeling');
  if (feeling) {
    context.feeling = feeling;
  }
  return feeling;
};

/*
  Facebook Actions
*/
const fbName = (context) => {
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
};

/*
  Weather Underground Actions
*/
const wuLocation = (context, entities) => {
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
};
const wuForecast = (context) => {
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
};

const getWit = () => {
  return new Wit({
    accessToken: tokens.WIT_TOKEN,
    actions: {
      send:   ({ context }, { text }) => send(context, text),
      clear:  ({ context })           => clear(context),
      nop:    ({ context })           => nop(context),
      merge:  ({ context, entities }) => merge(context, entities),
      // facebook
      fbName: ({ context }) => fbName(context),
      // weather underground
      wuLocation: ({ context, entities }) => wuLocation(context, entities),
      wuForecast: ({ context })           => wuForecast(context)
    }
  });
};

if (process.env.NODE_ENV !== 'development') {
  exports.getWit = getWit;
} else {
  module.exports = {
    getWit: getWit,
    entity: firstEntityValue,
    send: send,
    clear: clear,
    nop: nop,
    merge: merge,
    fbName: fbName,
    wuLocation: wuLocation,
    wuForecast: wuForecast
  };
}
