'use strict';

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN || 'faketoken';

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'faketoken';

let FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'faketoken';

// Weather Underground API
const WU_TOKEN = process.env.WU_TOKEN || 'faketoken';

// Encryption
const crypto = require('crypto');
const decrypt = function (input, password = process.env.CRYPTO_TOKEN) {
  // Convert urlsafe base64 to normal base64
  input = input.replace(/\-/g, '+').replace(/_/g, '/');
  // Convert from base64 to binary string
  var edata = new Buffer(input, 'base64').toString('binary')

  // Create key from password
  var m = crypto.createHash('md5');
  m.update(password);
  var key = m.digest('hex');

  // Create iv from password and key
  m = crypto.createHash('md5');
  m.update(password + key);
  var iv = m.digest('hex');

  // Decipher encrypted data
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv.slice(0, 16));

  return (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));
};

module.exports = {
  WU_TOKEN: WU_TOKEN,
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  decrypt: decrypt
};
