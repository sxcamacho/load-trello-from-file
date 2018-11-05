const app = require("./app.js");

// get the bob dylan's albums and the covers from spotify
app.getCoverAlbums()
    .then(covers => {
        // create a trello board and
        // create a trello list for each decade with at least one album
        app.initializeTrello()
            .then(boardId => {
                // read txt file and get the data
                app.getAlbumsFromFile().then(data => {
                    // create albums with covers
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
