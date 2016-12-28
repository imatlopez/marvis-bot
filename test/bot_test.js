require('./files/env.js').dev();
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

  it('firstEntityValue()', () => {
    assert.equal(
      bot.entity(json('test/files/ent.json'), 'location'),
      'San Francisco',
      'return the correct value'
    );
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
    assert.propertyVal(
      bot.merge({ psid:0 }, json('test/files/ent.json')),
      'feeling',
      'love',
      'should obtain feeling'
    );
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
    assert.eventually.property(
      bot.wuLocation({ psid:0 }, json('test/files/ent.json')),
      'link',
      'should find link to place'
    );
  });

  it('wuForecast()', () => {
    assert.eventually.property(
      bot.wuForecast({ psid:0, link:'/q/zmw:94101.1.99999' }),
      'missingForecast',
      'should get to missing'
    );
  });

});
