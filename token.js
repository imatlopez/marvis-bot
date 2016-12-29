'use strict';

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN || 'faketoken';

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'faketoken';

let FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'faketoken';

// Weather Underground API
const WU_TOKEN = process.env.WU_TOKEN || 'faketoken';

module.exports = {
  WU_TOKEN: WU_TOKEN,
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN
};
