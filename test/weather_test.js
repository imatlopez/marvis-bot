require('chai').use(require('chai-as-promised')).should();
const WU = require('../weather.js');
const nock = require('nock');

describe('weather.js', () => {
  describe('searchForecast()', () => {
    const ans = { value: 0 };
    it('receives data', () => {
      nock(/wunderground\.com/).get(/.*/).reply(200, ans);
      WU.searchForecast('#').should.eventually.deep.equal(
        ans,
        'should return object'
      );
    });
  });

  describe('searchLocation()', () => {
    const ans = { value: 0 };
    it('receives data', () => {
      nock(/wunderground\.com/).get(/.*/).reply(200, ans);
      WU.searchLocation('#').should.eventually.deep.equal(
        ans,
        'should return object'
      );
    });
  });

  describe('getForecast()', () => {
    it('true result', () => {
      nock(/wunderground\.com/).get(/.*/).reply(200, {
        current_observation: {
          weather: 'SUNNY',
          temp_f: 50
        }
      });
      return WU.forecast({ link:'#' }).should.eventually.have.property(
        'forecast', 'sunny'
      );
    });
    it('error result', () => {
      nock(/wunderground\.com/).get(/.*/).reply(404);
      return WU.forecast({ link:'#' }).should.eventually.have.property(
        'missingForecast'
      );
    });
  });

  describe('getLocation()', () => {
    const ent = {
      location: [{
        value: 'San Francisco'
      }]
    };
    it('true result', () => {
      nock(/wunderground\.com/).get(/.*/).reply(200, {
        RESULTS: [
          {
            l: '/q/',
            name: 'nowhere'
          }
        ] });
      return WU.location({ psid:'#' }, ent).should.eventually.have.property(
        'link', '/q/'
      );
    });
    it('error result', () => {
      nock(/wunderground\.com/).get(/.*/).reply(404);
      return WU.location({ link:'#' }, ent).should.eventually.have.property(
        'missingLocation'
      );
    });
  });

});
