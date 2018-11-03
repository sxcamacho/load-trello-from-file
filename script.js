const trello = require("./lib/trello.js");
const app = require("./app.js");

let boardId = undefined;
let albums = [];

app.initialize()
    .then(data => {
        boardId = data;
        app.getAlbumsFromFile().then(data => {
            albums = data;
        });
    })
    .catch(error => {
        console.error(error);
        process.exit(0);
    });
