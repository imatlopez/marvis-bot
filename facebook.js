'use strict';

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const request = require('request');
const tokens = require('./token.js');

const out = request.defaults({
  uri: 'https://graph.facebook.com/v2.6/me/messages',
  method: 'POST',
  json: true, headers: {
    'Content-Type': 'application/json'
  },
  qs: {
    access_token: tokens.FB_PAGE_TOKEN
  }
});


const message = (recipientId, msg, cb) => {
  const opts = {
    form: {
      recipient: {
        id: recipientId
      },
      message: {
        text: msg
      }
    }
  };

  out(opts, (err, resp, data) => {
    if (cb) {
      cb(err || data.error && data.error.message, data);
    }
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
  message: message,
  out: out
};
