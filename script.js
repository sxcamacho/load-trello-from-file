const trello = require("./lib/trello.js");
const app = require("./app.js");

app.initialize()
    .then(boardId => {
        app.getAlbumsFromFile().then(data => {
            app.createAlbums(boardId, data);
            //     .then(data => {})
            //     .catch(error => {
            //         console.error(error);
            //     });
        });
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
