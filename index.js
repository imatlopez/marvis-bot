'use strict';

// Messenger API integration example
// We assume you have:
// * a Wit.ai bot setup (https://wit.ai/docs/quickstart)
// * a Messenger Platform setup (https://developers.facebook.com/docs/messenger-platform/quickstart)
// You need to `npm install` the following dependencies: body-parser, express, request.
//
const bodyParser = require('body-parser');
const express = require('express');

// get Bot, const, and Facebook API
const bot = require('./bot.js');
const tokens = require('./token.js');
const FB = require('./facebook.js');

// Setting up our bot
const wit = bot.getWit();

// Webserver parameter
const PORT = process.env.PORT || 8445;

/*
  Wit.ai bot specific code
*/

// This will contain all user sessions. Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const getSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user id
  Object.keys(sessions).forEach((k) => {
    if (sessions[k].fbid === fbid) {
      sessionId = k;
    }
  });
  // No session found for user id, let's create a new one
  if (!sessionId) {
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        fbid: fbid
      }
    }; // set context, _fbid_
  }
  return sessionId;
};

// Starting our webserver and putting it all together
const app = express();
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.json());
console.log('I\'m wating for you @' + PORT);

// index. Let's say something fun
app.get('/', (req, res) => {
  res.send('"Only those who will risk going too far can possibly find out how far one can go." - T.S. Eliot');
});

// Webhook verify setup using FB_VERIFY_TOKEN
app.get('/webhook/', (req, res) => {
  if (!tokens.FB_VERIFY_TOKEN) {
    throw new Error('missing FB_VERIFY_TOKEN');
  }
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === tokens.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

// The main message handler
app.post('/webhook/', (req, res) => {
  // Parsing the Messenger API response
  const mail = FB.getMessage(req.body);
  if (mail && mail.message) { // Yay! We got a new message!

    // We retrieve the Facebook user ID of the sender and link to bot's
    // conversation history memory
    const sender = mail.sender.id;
    const fbid = getSession(sender);

    // We retrieve the message content
    const text = mail.message.text;
    const attachments = mail.message.attachments;

    if (attachments) { // We received an attachment
      FB.message(sender, 'Sorry I can only process text messages for now.');
    } else if (text) { // We received a text message
      wit.runActions(
        fbid,                   // the user's current session
        text,                   // the user's message
        sessions[fbid].context  // the user's current session state
      ).then((context) => {
        console.log('Waiting for futher messages.');
        sessions[fbid].context = context;
      }).catch((error) => {
        console.log('Oops! Got an error from Wit:', error);
      });
    }
  }
  res.sendStatus(200);
});
