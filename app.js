const config = require("./config.js");
const fs = require("fs");
const rl = require("readline");
const trello = require("./lib/trello.js");
const spotify = require("./lib/spotify.js");

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (
        (longerLength - editDistance(longer, shorter)) /
        parseFloat(longerLength)
    );
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue =
                            Math.min(Math.min(newValue, lastValue), costs[j]) +
                            1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

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
                                coversFiltered = covers.filter(
                                    cover => cover.name === album.title
                                );
                                if (coversFiltered.length === 0) {
                                    coversFiltered = covers.filter(
                                        cover =>
                                            cover.year === album.year &&
                                            cover.name.substr(0, 3) ===
                                                album.title.substr(0, 3)
                                    );
                                }
                                if (coversFiltered.length === 0) {
                                    coversFiltered = covers.filter(
                                        cover =>
                                            similarity(
                                                cover.name,
                                                album.title
                                            ) > 0.6
                                    );
                                }

                                if (coversFiltered.length > 0) {
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
                                //console.log(albums[0]);
                                let coverAlbums = albums.map(album => {
                                    let year = parseInt(
                                        album.release_date.substr(0, 4)
                                    );
                                    return {
                                        year,
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
