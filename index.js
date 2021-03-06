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
const FBM = require('./messenger.js');

// Setting up our bot
const wit = bot.getWit();

// Webserver parameter
const PORT = process.env.PORT || 3000;

// This will contain all user sessions. Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const getSession = (psid) => {
  let sessionId;
  // Let's see if we already have a session for the user id
  Object.keys(sessions).forEach((k) => {
    if (sessions[k].psid === psid) {
      sessionId = k;
    }
  });
  // No session found for user id, let's create a new one
  if (!sessionId) {
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      psid: psid,
      context: {
        psid: psid
      }
    }; // set context, _fbid_
  }
  return sessionId;
};

// Starting our webserver and putting it all together
const app = express();
app.set('port', PORT);
app.use(bodyParser.json());
app.use(express.static('public'));
const server = app.listen(app.get('port'));

// index. Let's say something fun
app.get('/', (req, res) => {
  res.sendFile('puzzle/index.html', { root : __dirname });
});
app.get('/css/15-puzzle.min.css', (req, res) => {
  res.sendFile('puzzle/css/15-puzzle.min.css', { root : __dirname });
});
app.get('/js/15-puzzle.min.js', (req, res) => {
  res.sendFile('puzzle/js/15-puzzle.min.js', { root : __dirname });
});

// Me Too Monologues
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use('/metoo', bodyParser.json());
app.get('/metoo', (req, res) => {
  const copy = `${new Date().getFullYear()}`;
  let query;
  try {
    query = tokens.decrypt(req.query.id).split('@');
  } catch (e) {
    query = [];
  }
  if (query.length === 3) {
    res.render('metoo', { name: query[0], spot: query[1], date: query[2], copy:  copy });
  } else {
    res.render('metoo404', { copy:  copy });
  }
});

// Webhook verify setup using FB_VERIFY_TOKEN
app.get('/webhook/', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === tokens.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

// The main message handler
app.post('/webhook/', (req, res) => {
  const mail = FBM.getMessage(req.body);
  if (mail && mail.message) { // Yay! We got a new message!

    const sender = mail.sender.id;
    const psid = getSession(sender);

    const text = mail.message.text;
    const attachments = mail.message.attachments;

    if (attachments) { // We received an attachment
      FBM.send(sender, 'Sorry I can only process text messages for now.');
    } else if (text) { // We received a text message
      wit.runActions(
        psid,                   // the user's current session
        text,                   // the user's message
        sessions[psid].context  // the user's current session state
      ).then((context) => {
        console.log('Waiting for futher messages.');
        sessions[psid].context = context;
      }).catch((error) => {
        console.log('Oops! Got an error from Wit:', error);
      });
    }
  }
  res.sendStatus(200);
});

module.exports = {
  session: getSession,
  server: server
};
