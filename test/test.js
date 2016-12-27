var assert = require('assert');

process.env.NODE_ENV = 'development';
process.env.WIT_TOKEN = 'fakewittoken';
process.env.FB_PAGE_TOKEN = 'fakefbpagetoken';
process.env.FB_VERIFY_TOKEN = 'fakefbverifytoken';
process.env.WU_TOKEN = 'fakewutoken';
process.env.GMAPS_TOKEN = 'fakegmapstoken';

describe('token.js', () => {
  describe('WIT_TOKEN', () => {
    it('return the correct value', () => {
      var tokens = require('../token.js');
      assert.equal(process.env.WIT_TOKEN, tokens.WIT_TOKEN);
    });
  });
  describe('FB_PAGE_TOKEN', () => {
    it('return the correct value', () => {
      var tokens = require('../token.js');
      assert.equal(process.env.FB_PAGE_TOKEN, tokens.FB_PAGE_TOKEN);
    });
  });
  describe('FB_VERIFY_TOKEN', () => {
    it('return the correct value', () => {
      var tokens = require('../token.js');
      assert.equal(process.env.FB_VERIFY_TOKEN, tokens.FB_VERIFY_TOKEN);
    });
  });
  describe('WU_TOKEN', () => {
    it('return the correct value', () => {
      var tokens = require('../token.js');
      assert.equal(process.env.WU_TOKEN, tokens.WU_TOKEN);
    });
  });
  describe('GMAPS_TOKEN', () => {
    it('return the correct value', () => {
      var tokens = require('../token.js');
      assert.equal(process.env.GMAPS_TOKEN, tokens.GMAPS_TOKEN);
    });
  });
});
