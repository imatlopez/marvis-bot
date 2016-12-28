require('./files/env.js').dev();
const assert = require('chai').assert;
const json = (file) => JSON.parse(require('fs').readFileSync(file));
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
    assert.equal(
      FBM.getMessage(json('test/files/msg.json')).message.text,
      'in London?',
      'correctly parsed message'
    );
  });

});
