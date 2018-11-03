const config = require("./config.js");
const account = require("./account.js");
const boards = require("./boards.js");
const albums = require("./albums.js");
const trello = require("./lib/trello.js");

const boardName = "Bob Dylan";
let boardId = undefined;
// albums.loadAlbums(config.FILE_PATH).then(data => {
//     console.log(data);
// });

console.log("initializing...");
Promise.all([account.getMe(), boards.deleteBoardsWithName(boardName)]).then(
    () => {
        boards.createBoard(boardName).then(data => {
            boardId = data;
        });
    }
);
