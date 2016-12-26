'use strict';

const request = require('request-promise');
const tokens = require('./token.js');

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
    console.log(response);
    return JSON.parse(response);
  });
};

module.exports = {
  user: getUserInfo
};
