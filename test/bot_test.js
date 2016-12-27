var assert = require('chai').assert;

// Enable Variables
process.env.NODE_ENV = 'development';
process.env.WIT_TOKEN = 'fakewittoken';
process.env.FB_PAGE_TOKEN = 'fakefbpagetoken';
process.env.FB_VERIFY_TOKEN = 'fakefbverifytoken';
process.env.WU_TOKEN = 'fakewutoken';
process.env.GMAPS_TOKEN = 'fakegmapstoken';

// Include required files
var bot = require('../bot.js');

describe('bot.js', () => {

  it('Bot creation', () => {
    var client = bot.getWit();
    assert.isNotNull(client, 'Bot created');
  });
});
