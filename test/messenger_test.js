require('chai').use(require('chai-as-promised')).should();
const assert = require('chai').use(require('chai-as-promised')).assert;
const json = (file) => JSON.parse(require('fs').readFileSync(file));
const FBM = require('../messenger.js');
const nock = require('nock');

describe('messenger.js', () => {

  describe('postMessage()', () => {
    it('true result', () => {
      nock(/facebook\.com/).post(/.*/).reply(200);
      return FBM.postMessage('sung', 'hello').should.be.fulfilled;
    });
    it('false result', () => {
      nock(/facebook\.com/).post(/.*/).reply(404);
      return FBM.postMessage('sung', 'hello').should.be.rejected;
    });
  });

  describe('getMessage()', () => {
    it('true result', () => {
      assert.equal(
        FBM.getMessage(json('test/files/msg.json')).message.text,
        'in London?',
        'correctly parsed message'
      );
    });
    it('false result', () => {
      assert.isNull(
        FBM.getMessage({ hi: 'ah' }),
        'there was no message'
      );
    });
  });

  describe('send()', () => {
    it('true result', () => {
      return FBM.send({ psid:'ralph' }, 'me').should.equal(0);
    });
    it('false result', () => {
      return FBM.send({ psix:'ralph' }, 'me').should.equal(1);
    });
  });

});
