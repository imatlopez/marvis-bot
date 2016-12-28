require('./files/env.js').dev();
const assert = require('chai').use(require('chai-as-promised')).assert;
const app = require('../index.js');

describe('index.js', () => {

  var str = null;

  it('first session', () => {
    str = app.session(123);
    assert.isString(
      str,
      'should return a string'
    );
  });

  it('second session', () => {
    assert.equal(
      app.session(123),
      str,
      'should return the same string'
    );
  });

});
