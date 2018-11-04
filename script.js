const app = require("./app.js");

app.getCoverAlbums()
    .then(covers => {
        app.initializeTrello()
            .then(boardId => {
                app.getAlbumsFromFile().then(data => {
                    app.createAlbums(boardId, covers, data);
                });
            })
            .catch(error => {
                console.error(error);
                process.exit(1);
            });
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
