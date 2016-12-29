'use strict';

const request = require('request-promise');
const tokens = require('./token.js');

/**
 * Get user's page info
 * @param {String} psid
 * @return {Promise}
 */
const getUserInfo = (psid) => {
  return request({
    uri: 'https://graph.facebook.com/v2.8/' + psid,
    method: 'GET',
    json: true, headers: {
      'Content-Type': 'application/json'
    },
    qs: {
      access_token: tokens.FB_PAGE_TOKEN
    }
  }).then((response) => {
    console.log('GET', 'https://graph.facebook.com/v2.8/' + psid + '?access_token=FB_PAGE_TOKEN');
    return response;
  });
};

/**
 * Get user's first name
 * @param {Object} context
 * @return {Object}
 */
const getFirstName = (context) => {
  // Finding user's first name
  return getUserInfo(context.psid).then((response) => {
    const name = response['first_name'];
    if (name) {
      context.name = name;
      delete context.noName;
    } else {
      context.noName = true;
    }
    return context;
  }).catch((e) => {
    context.noName = e;
    return context;
  });
};

module.exports = {
  user: getUserInfo,
  name: getFirstName
};
