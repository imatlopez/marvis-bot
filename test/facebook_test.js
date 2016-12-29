require('chai').use(require('chai-as-promised')).should();
const FB = require('../facebook.js');
const bot = require('../bot.js');
const nock = require('nock');

describe('facebook.js', () => {
  describe('getUserInfo()', () => {
    const ans = { value: 0 };
    it('receives data', () => {
      nock(/facebook\.com/).get(/.*/).reply(200, ans);
      return FB.user('#').should.eventually.deep.equal(
        ans,
        'should return object'
      );
    });
  });
  describe('getFirstName()', () => {
    it('true result', () => {
      nock(/facebook\.com/).get(/.*/).reply(200, { first_name: 'abe' });
      return bot.actions.fbName({ context:{ psid:'#' } }).should.eventually.have.property(
        'name', 'abe'
      );
    });
    it('false result', () => {
      nock(/facebook\.com/).get(/.*/).reply(200, { name_first: 'abe' });
      return bot.actions.fbName({ context:{ psid:'#' } }).should.eventually.have.property(
        'noName'
      );
    });
    it('error result', () => {
      nock(/facebook\.com/).get(/.*/).reply(404);
      return bot.actions.fbName({ context:{ psid:'#' } }).should.eventually.have.property(
        'noName'
      );
    });
  });
});
