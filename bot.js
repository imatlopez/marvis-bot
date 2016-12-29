'use strict';

const tokens = require('./token.js');
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const FBM = require('./messenger.js');
const WU = require('./weather.js');

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
 * Clears context of all acquired information
 * @param {Object} context
 * @return {Object}
 */
const clear = (context) => {
  for (let property in context) {
    if (property !== 'psid') { delete context[property]; }
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

const actions = {
  clear:  ({ context })           => clear(context),
  nop:    ({ context })           => nop(context),
  merge:  ({ context, entities }) => merge(context, entities),
  // messenger
  send: ({ context }, { text }) => FBM.send(context, text),
  // facebook
  fbName: ({ context }) => FB.name(context),
  // weather underground
  wuLocation: ({ context, entities }) => WU.location(context, entities),
  wuForecast: ({ context })           => WU.forecast(context)
};

/**
 * Interface to Wit.ai API
 * @return {Object} Wit.ai
 */
const getWit = () => {
  return new Wit({
    accessToken: tokens.WIT_TOKEN,
    actions: actions
  });
};

module.exports = {
  getWit: getWit,
  entity: firstEntityValue,
  actions: actions
};
