const fs = require("fs");
const rl = require("readline");

module.exports = {
  loadAlbums: filePath => {
    var albums = [];
    return new Promise((resolve, reject) => {
      var lineReader = rl.createInterface({
        input: fs.createReadStream(filePath)
      });

      lineReader.on("line", function(line) {
        var year = parseInt(line.substr(0, 4));
        var title = line.substr(5, line.length - 5);
        albums.push({
          year,
          title
        });
      });

      lineReader.on("close", () => {
        albums = albums.sort((a, b) => {
          if (a.year === b.year) {
            // Price is only important when cities are the same
            return a.title > b.title ? 1 : -1;
          }
          return a.year - b.year;
        });
        resolve(albums);
      });
    });
  }
};
