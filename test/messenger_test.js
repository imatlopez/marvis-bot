var assert = require('chai').assert;

// Enable Variables
process.env.NODE_ENV = 'development';
process.env.WIT_TOKEN = 'fakewittoken';
process.env.FB_PAGE_TOKEN = 'fakefbpagetoken';
process.env.FB_VERIFY_TOKEN = 'fakefbverifytoken';
process.env.WU_TOKEN = 'fakewutoken';
process.env.GMAPS_TOKEN = 'fakegmapstoken';

// Include required files
var FBM = require('../messenger.js');

describe('messenger.js', () => {

  it('message()', () => {
    var ret = FBM.message('sung', 'hello');
    assert.notEqual(
      ret,
      undefined,
      'no return, so undefined'
    );
  });

  it('getMessage()', () => {
    var payload = null;
    require('fs').readFile('./msg.json', 'utf8', (err, data) => {
      if (err) {
        throw err; // we'll not consider error handling for now
      }

      payload = JSON.parse(data);
      assert(payload !== null);

      var ret = FBM.getMessage(payload);
      assert.equal(
        ret.message.text,
        'in London?',
        'correctly parsed message'
      );
    });
  });

});
