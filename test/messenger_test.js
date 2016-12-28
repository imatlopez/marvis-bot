require('./files/env.js').dev();
const assert = require('chai').assert;
const FBM = require('../messenger.js');

describe('messenger.js', () => {

  it('message()', () => {
    const ret = FBM.message('sung', 'hello');
    assert.notEqual(
      ret,
      undefined,
      'no return, so undefined'
    );
  });

  it('getMessage()', () => {
    require('fs').readFile('./test/files/msg.json', 'utf8', (err, data) => {
      if (err) {
        throw err; // we'll not consider error handling for now
      }

      const payload = JSON.parse(data);
      const ret = FBM.getMessage(payload);
      assert.equal(
        ret.message.text,
        'in London?',
        'correctly parsed message'
      );
    });
  });

});
