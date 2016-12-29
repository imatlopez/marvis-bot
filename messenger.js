'use strict';

const request = require('request-promise');
const tokens = require('./token.js');

/**
 * Send message through messenger API
 * @param {String} recipientId
 * @param {String} msg
 * @return {Promise}
 */
const postMessage = (recipientId, msg) => {
  return request({
    uri: 'https://graph.facebook.com/v2.8/me/messages',
    method: 'POST',
    json: true, headers: {
      'Content-Type': 'application/json'
    },
    qs: {
      access_token: tokens.FB_PAGE_TOKEN
    },
    form: {
      recipient: {
        id: recipientId
      },
      message: {
        text: msg
      }
    }
  }).catch((e) => { throw e; });
};

/**
 * Parse nessenger data
 * @param {Object} body
 * @return {String}
 */
const getMessage = (body) => {
  const val = body.object === 'page' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].messaging &&
    Array.isArray(body.entry[0].messaging) &&
    body.entry[0].messaging.length > 0 &&
    body.entry[0].messaging[0];

  return val || null;
};

/**
 * Send message through messenger API
 * @param {Object} context
 * @param {String} text
 */
const send = (context, text) => {
  const id = context.psid;
  if (id) {
    postMessage(id, text).catch((error) => {
      console.warn('Messenger Error @' + id, ':\n', error);
    });
    return 0;
  }
  console.warn('Couldn\'t find user in context:', context);
  return 1;
};


module.exports = {
  getMessage: getMessage,
  postMessage: postMessage,
  send: send
};
