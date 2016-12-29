require('chai').use(require('chai-as-promised')).should();
const assert = require('chai').use(require('chai-as-promised')).assert;
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
      const testObj = { psid: 'abc' };
      return bot.actions.clear({ context:testObj }).should.deep.equal(testObj);
    });

    it('returns delete unnecessary properties', () => {
      const testObj = { psid: 'abc', del: 'bye' };
      return bot.actions.clear({ context:testObj }).should.not.have.property('del');
    });

  });

  it('nop()', () => {
    const testObj = { value:123 };
    return bot.actions.nop({ context:testObj }).should.equal(testObj);
  });

  describe('merge()', () => {
    it('returns context', () => {
      return bot.actions.merge({
        context: { psid:0 },
        entities: undefined
      }).should.have.property('psid', 0);
    });
    it('feeling', () => {
      return bot.actions.merge({
        context: { psid:0 },
        entities: {
          feeling: [{
            value: 'love'
          }]
        }
      }).should.have.property('feeling', 'love');
    });
  });

});
