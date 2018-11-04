const app = require("./app.js");

// app.initialize()
//     .then(boardId => {
//         app.getAlbumsFromFile().then(data => {
//             app.createAlbums(boardId, data);
//             //     .then(data => {})
//             //     .catch(error => {
//             //         console.error(error);
//             //     });
//         });
//     })
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });

app.getCoverAlbums()
    .then(covers => {
        console.log(covers);
    })
    .catch(error => {
        console.error(error);
    });
