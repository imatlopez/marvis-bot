'use strict';

const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const FBM = require('./messenger.js');
const WU = require('./weather.js');
const tokens = require('./token.js');

/**
 * Obtain entity value from entities object
 * @param {Object} entities
 * @param {String} entity
 * @return {String}
 */
const firstEntityValue = (entities, entity) => {

  let val = entities && entities[entity];
  val = val && Array.isArray(entities[entity]);
  val = val && entities[entity].length > 0;
  val = val && entities[entity][0].value;

  if (!val) { return null; }
  return typeof val === 'object' ? val.value : val;
};

/**
 * Send message through messenger API
 * @param {Object} context
 * @param {String} text
 */
const send = (context, text) => {
  const id = context.psid;
  if (id) {
    // Yay, we found our recipient!
    FBM.message(id, text).catch((error) => {
      console.warn('Messenger Error @' + id, ':\n', error);
    });
    return;
  }
  throw new Error('Couldn\'t find user in context:', context);
};

/**
 * Clears context of all acquired information
 * @param {Object} context
 * @return {Object}
 */
const clear = (context) => {
  for (let property in context) {
    if (context.hasOwnProperty(property)) {
      if (property !== 'psid') { delete context[property]; }
    }
  }
  return context;
};

/**
 * No action, empty instruction
 * @param {Object} context
 * @return {Object}
 */
const nop = (context) => context;

const merge = (context, entities) => {
  const feeling = firstEntityValue(entities, 'feeling');
  if (feeling) { context.feeling = feeling; }
  return context;
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

/**
 * Valid location from query and link
 * @param {Object} context
 * @return {Promise}
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
      console.warn('WU API Error:\n', error);
      context.missingLocation = true;
      return context;
    });
  } else {
    context.missingLocation = true;
    return context;
  }
};

/**
 * Temperature and climate at a location
 * @param {Object} context
 * @return {Promise}
 */
const wuForecast = (context) => {
  if (context.link) {
    return WU.get(context.link).then((response) => {
      if (response['current_observation']) {
        context.forecast = response['current_observation'].weather.toLowerCase();
        context.temp_f = response['current_observation']['temp_f'];
      } else {
        console.warn('WU Response Error:\n', response);
        delete context.missingForecast;
      }
      return context;
    }).catch((error) => {
      console.warn('WU API Error:\n', error);
      context.missingForecast = true;
      return context;
    });
  } else {
    context.missingForecast = true;
    return context;
  }
};

/**
 * Interface to Wit.ai API
 * @return {Object} Wit.ai
 */
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
