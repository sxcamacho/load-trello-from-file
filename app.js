const trello = require("./lib/trello.js");
const config = require("./config.js");
const fs = require("fs");
const rl = require("readline");

module.exports = {
    initialize: () => {
        console.log("initializing...");
        return new Promise((resolve, reject) => {
            trello
                .getMe()
                .then(data => {
                    console.log(`connected to ${data.name}'s trello account`);
                    trello
                        .deleteBoardsWithName(config.BOARD_NAME)
                        .then(() => {
                            trello
                                .createBoard(config.BOARD_NAME)
                                .then(data => {
                                    resolve(data);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        })
                        .catch(error => {
                            reject(error);
                        });
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    getAlbumsFromFile: () => {
        var albums = [];
        return new Promise((resolve, reject) => {
            var lineReader = rl.createInterface({
                input: fs.createReadStream(config.FILE_PATH)
            });

            lineReader.on("line", function(line) {
                var year = parseInt(line.substr(0, 4));
                var title = line.substr(5, line.length - 5);
                albums.push({
                    decade: parseInt(
                        (Math.floor(year / 10) * 10).toString().slice(-2)
                    ),
                    year,
                    title
                });
            });

            lineReader.on("close", () => {
                albums = albums.sort((a, b) => {
                    if (a.year === b.year) {
                        // title is only important when year are the same
                        return a.title > b.title ? 1 : -1;
                    }
                    return a.year - b.year;
                });
                resolve(albums);
            });
        });
    }
};
