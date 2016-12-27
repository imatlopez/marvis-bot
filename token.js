'use strict';

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;
if (!WIT_TOKEN) {
  throw new Error('missing WIT_TOKEN');
}

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

let FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
if (!FB_VERIFY_TOKEN) {
  FB_VERIFY_TOKEN = WIT_TOKEN;
}

// Weather Underground API
const WU_TOKEN = process.env.WU_TOKEN;
if (!WU_TOKEN) {
  throw new Error('missing WU_TOKEN');
}

// Google Maps API
const GMAPS_TOKEN = process.env.GMAPS_TOKEN;
if (!GMAPS_TOKEN) {
  throw new Error('missing GMAPS_TOKEN');
}

module.exports = {
  WU_TOKEN: WU_TOKEN,
  WIT_TOKEN: WIT_TOKEN,
  GMAPS_TOKEN: GMAPS_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN
};
