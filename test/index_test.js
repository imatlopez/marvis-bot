require('chai').use(require('chai-as-promised')).should();
const token = require('../token.js');
const app = require('../index.js');
var request = require('supertest');

describe('index.js', () => {

  describe('getSession()', () => {
    var str;

    it('first session', () => {
      return app.session('456').should.not.be.undefined;
    });

    it('second session', () => {
      str = app.session('123');
      return str.should.not.be.undefined;
    });

    it('repeat second session', () => {
      return app.session('123').should.equal(str);
    });
  });

  it('/', () => {
    return request(app.server).get('/').expect(200);
  });

  describe('/webhook/', () => {
    it('empty response', () => {
      return request(app.server).get('/webhook/').expect(400);
    });
    it('subscribe', () => {
      return request(app.server).get('/webhook/').query({
        'hub.mode': 'subscribe',
        'hub.verify_token': token.FB_VERIFY_TOKEN,
        'hub.challenge': '123'
      }).expect(200, '123');
    });
    describe('messaging', () => {
      const msg = { object: 'page', entry: [{
        messaging: [{
          sender: { id: 123 },
          recipient: { id: 456 },
          message: {}
        }]
      }] };
      it('invalid message', () => {
        return request(app.server).post('/webhook/').send('hi').expect(200);
      });
      it('empty', () => {
        return request(app.server).post('/webhook/').send(msg).expect(200);
      });
      it('message', () => {
        msg.entry[0].messaging[0].message.text = 'hi';
        return request(app.server).post('/webhook/').send(msg).expect(200);
      });
      it('attachments', () => {
        msg.entry[0].messaging[0].message.attachments = 'bye';
        return request(app.server).post('/webhook/').send(msg).expect(200);
      });
    });
  });
});
