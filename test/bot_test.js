require('./files/env.js').dev();
const assert = require('chai').use(require('chai-as-promised')).assert;
const bot = require('../bot.js');

describe('bot.js', () => {

  it('Bot creation', () => {
    assert.isNotNull(
      bot.getWit(),
      'Bot created'
    );
  });

  it('firstEntityValue()', () => {
    require('fs').readFile('./test/files/ent.json', 'utf8', (err, data) => {
      if (err) {
        throw err; // we'll not consider error handling for now
      }
      assert.equal(
        bot.entity(JSON.parse(data), 'location'),
        'San Francisco',
        'return the correct value'
      );
    });

  });

  it('send()', () => {
    assert.equal(
      bot.send({ psid:'ralph' }, 'me'),
      undefined,
      'should return null'
    );
  });

  it('clear()', () => {
    assert.isNull(
      bot.clear({ value:123 }),
      'should return null'
    );
  });

  it('nop()', () => {
    assert.equal(
      bot.nop(123),
      123,
      'should return the value given'
    );
  });

  it('merge()', () => {
    require('fs').readFile('./test/files/ent.json', 'utf8', (err, data) => {
      if (err) {
        throw err; // we'll not consider error handling for now
      }
      assert.eventually.propertyVal(
        bot.merge({ psid:0 }, JSON.parse(data)),
        'feeling',
        'love',
        'should obtain feeling'
      );
    });
  });

  it('fbName()', () => {
    assert.eventually.propertyVal(
      bot.fbName({ psid:0 }),
      'noName',
      true,
      'should find no user name'
    );
  });

  it('wuLocation()', () => {
    require('fs').readFile('./test/files/ent.json', 'utf8', (err, data) => {
      if (err) {
        throw err; // we'll not consider error handling for now
      }
      assert.eventually.property(
        bot.wuLocation({ psid:0 }, JSON.parse(data)),
        'link',
        'should find link to place'
      );
    });
  });

  it('wuForecast()', () => {
    assert.eventually.property(
      bot.wuForecast({ psid:0, link:'/q/zmw:94101.1.99999' }),
      'missingForecast',
      'should get to missing'
    );
  });

});
