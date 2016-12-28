// Enable Variables
const dev = () => {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
    process.env.WIT_TOKEN = 'D4YURT4GTRYNSFLSCXXNWHUQDCY2DBFV';
    process.env.FB_PAGE_TOKEN = 'EAARMx0PABlkBADxNb8wqiIf2hirHNaTCQsYJHlJ1eM0NqkmfkZBxSMwKSRYn2dvKKrzxE7XZAtq92dvy1D2yZA7PPZCGeNwVTqhMaqEkHTuZCRCZAqZCz03RoM4641e5b9cXajsHBhk0DCUwvMV2kj9ANYvPueZCSqkEU9Y5Eyyo2AZDZD';
    process.env.FB_VERIFY_TOKEN = 'my_name_is_wallace_the_blue_wallaby';
    process.env.WU_TOKEN = '385c2b292f6c5c51';
    process.env.GMAPS_TOKEN = 'AIzaSyDN3liuyrD-7q_wLCSEtuSmKNAFhWrTa4k';
  }
};

module.exports = {
  dev: dev
};
