const config = require("./config.js");
const fs = require("fs");
const rl = require("readline");
const trello = require("./lib/trello.js");
const spotify = require("./lib/spotify.js");

var self = (module.exports = {
    initializeTrello: () => {
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
                    year,
                    decade: parseInt((Math.floor(year / 10) * 10).toString()),
                    title: title.replace("’", "'")
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
    },
    sortAlbums: albums => {
        return albums.sort((a, b) => {
            if (a.year === b.year) {
                // title is only important when year are the same
                return a.title > b.title ? 1 : -1;
            }
            return a.year - b.year;
        });
    },
    createAlbums: (boardId, covers, albums) => {
        let decades = [];
        albums.map(album => {
            if (!decades.includes(album.decade)) {
                decades.push(album.decade);
            }
        });
        decades = decades.sort((a, b) => a > b);
        decades.map((decade, index) => {
            trello
                .createList(boardId, decade.toString(), index + 1)
                .then(listId => {
                    list = self.sortAlbums(
                        albums.filter(album => album.decade === decade)
                    );
                    list.map((album, index) => {
                        let albumName = `${album.year} ${album.title}`;
                        trello
                            .createCard(listId, albumName, index + 1)
                            .then(cardId => {
                                console.log("Album: " + albumName);
                                coversFiltered = covers.filter(
                                    cover => cover.name === album.title
                                );
                                if (coversFiltered.length > 0) {
                                    console.log("ADDED ******************");
                                    trello.addCoverToCard(
                                        cardId,
                                        coversFiltered[0].image
                                    );
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    });
                });
        });
    },
    getCoverAlbums: () => {
        return new Promise((resolve, reject) => {
            spotify
                .getToken()
                .then(() => {
                    spotify
                        .getArtist("Bob Dylan")
                        .then(artistId => {
                            spotify.getAlbums(artistId).then(albums => {
                                let coverAlbums = albums.map(album => {
                                    return {
                                        name: album.name,
                                        image: album.images[0].url
                                    };
                                });
                                resolve(coverAlbums);
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
    }
});
