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
// sessionId -> {id: facebookUserId, context: sessionState}
const sessions = {};

const getSession = (id) => {
  let sessionId;
  // Let's see if we already have a session for the user id
  Object.keys(sessions).forEach((k) => {
    if (sessions[k].id === id) {
      sessionId = k;
    }
  });
  // No session found for user id, let's create a new one
  if (!sessionId) {
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      id: id,
      context: {
        FB_ID: id
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
app.post('/', (req, res) => {
  // Parsing the Messenger API response
  const mail = FB.getMessage(req.body);
  if (mail && mail.message) { // Yay! We got a new message!

    // We retrieve the Facebook user ID of the sender
    const sender = mail.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    const id = getSession(sender);

    // We retrieve the message content
    const msg = mail.message.text;
    const atts = mail.message.attachments;

    if (atts) { // We received an attachment
      // Let's reply with an automatic message
      FB.message(sender,
        'Sorry I can only process text messages for now.'
      );
    } else if (msg) { // We received a text message
      // Let's forward the message to the Wit.ai Bot Engine
      // This will run all actions until our bot has nothing left to do
      wit.runActions(
        id, // the user's current session
        msg, // the user's message
        sessions[id].context, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            // Our bot did everything it has to do.
            // Now it's waiting for further messages to proceed.
            console.log('Waiting for futher messages.');

            // Based on the session state, you might want to reset the session.
            // This depends heavily on the business logic of your bot.
            // Example:
            // if (context['done']) {
            //   delete sessions[sessionId];
            // }

            // Updating the user's current session state
            sessions[id].context = context;
          }
        }
      );
    }
  }
  res.sendStatus(200);
});
