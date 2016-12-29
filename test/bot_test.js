const assert = require('chai').use(require('chai-as-promised')).assert;
const json = (file) => JSON.parse(require('fs').readFileSync(file));
const bot = require('../bot.js');

describe('bot.js', () => {

  it('Bot creation', () => {
    assert.isNotNull(
      bot.getWit(),
      'Bot created'
    );
  });

  describe('firstEntityValue()', () => {
    const ent = {
      location: [{
        value : 'San Francisco'
      }]
    };
    it('find valid value', () => {
      assert.equal(
        bot.entity(ent, 'location'),
        'San Francisco',
        'return the correct value'
      );
    });

    it('pass invalid null', () => {
      assert.isNull(
        bot.entity(ent, 'patience'),
        'return null'
      );
    });
  });

  describe('clear()', () => {

    it('returns argument', () => {
      const testObj = { psid: 'abc', value:123 };
      assert.equal(
        bot.clear(testObj),
        testObj,
        'should return input'
      );
    });

    it('keeps ID', () => {
      const testObj = { psid: 'abc', value:123 };
      assert.propertyVal(
        bot.clear(testObj),
        'psid',
        'abc',
        'should keep some properties'
      );
    });

  });

  it('nop()', () => {
    assert.equal(
      bot.nop(123),
      123,
      'should return the value given'
    );
  });

  it('merge()', () => {
    assert.propertyVal(
      bot.merge({ psid:0 }, json('test/files/ent.json')),
      'feeling',
      'love',
      'should obtain feeling'
    );
  });

});
