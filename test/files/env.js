// Enable Variables
const dev = () => {
  process.env.NODE_ENV = 'development';
  process.env.WIT_TOKEN = 'fakewittoken';
  process.env.FB_PAGE_TOKEN = 'fakefbpagetoken';
  process.env.FB_VERIFY_TOKEN = 'fakefbverifytoken';
  process.env.WU_TOKEN = 'fakewutoken';
  process.env.GMAPS_TOKEN = 'fakegmapstoken';
};

module.exports = {
  dev: dev
};
