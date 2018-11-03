const https = require("https");
const config = require("./config.js");
const albums = require("./albums.js");

albums.loadAlbums(config.FILE_PATH).then(data => {
  console.log(data);
});
