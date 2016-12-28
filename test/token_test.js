require('./files/env.js').dev();
const assert = require('chai').assert;
const tokens = require('../token.js');

describe('token.js', () => {
  it('WIT_TOKEN value', () => {
    assert.equal(
      process.env.WIT_TOKEN,
      tokens.WIT_TOKEN,
      'equals environment variable'
    );
  });
  it('FB_PAGE_TOKEN value', () => {
    assert.equal(
      process.env.FB_PAGE_TOKEN,
      tokens.FB_PAGE_TOKEN,
      'equals environment variable'
    );
  });
  it('FB_VERIFY_TOKEN value', () => {
    assert.equal(
      process.env.FB_VERIFY_TOKEN,
      tokens.FB_VERIFY_TOKEN,
      'equals environment variable'
    );
  });
  it('WU_TOKEN value', () => {
    assert.equal(
      process.env.WU_TOKEN,
      tokens.WU_TOKEN,
      'equals environment variable'
    );
  });
  it('GMAPS_TOKEN value', () => {
    assert.equal(
      process.env.GMAPS_TOKEN,
      tokens.GMAPS_TOKEN,
      'equals environment variable'
    );
  });
});
