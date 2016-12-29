const assert = require('chai').assert;
const token = require('../token.js');

describe('token.js', () => {
  it('WIT_TOKEN', () => {
    assert(
      token.WIT_TOKEN === process.env.WIT_TOKEN || token.WIT_TOKEN === 'faketoken',
      'equals environment variable'
    );
  });
  it('FB_PAGE_TOKEN', () => {
    assert(
      token.FB_PAGE_TOKEN === process.env.FB_PAGE_TOKEN || token.FB_PAGE_TOKEN === 'faketoken',
      'equals environment variable'
    );
  });
  it('FB_VERIFY_TOKEN', () => {
    assert(
      token.FB_VERIFY_TOKEN === process.env.FB_VERIFY_TOKEN || token.FB_VERIFY_TOKEN === 'faketoken',
      'equals environment variable'
    );
  });
  it('WU_TOKEN', () => {
    assert(
      token.WU_TOKEN === process.env.WU_TOKEN || token.WU_TOKEN === 'faketoken',
      'equals environment variable'
    );
  });
});
