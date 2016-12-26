'use strict';

const request = require('request-promise');
const tokens = require('./token.js');

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const message = (recipientId, msg) => {
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
  }).catch((e) => {
    console.log('Could not send message (', msg, '):', e);
  });
};

// See the Webhook reference
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
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


module.exports = {
  getMessage: getMessage,
  message: message
};
