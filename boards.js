const trello = require("./lib/trello.js");

module.exports = {
    deleteBoardsWithName: boardName => {
        return new Promise((resolve, reject) => {
            trello
                .getBoards()
                .then(({ data }) => {
                    var boards = data.filter(board => board.name === boardName);
                    var requests = boards.map(board => {
                        return deleteBoard(board.id);
                    });

                    Promise.all(requests)
                        .then(() => {
                            resolve();
                        })
                        .catch(error => {
                            console.error(error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    },
    deleteBoard: boardId => {
        return trello
            .deleteBoard()
            .then(() => {
                console.log(`board ${boardId} has been deleted.`);
            })
            .catch(error => {
                console.error(`We can't delete board ${boardId}.`);
                console.error(error);
            });
    },
    createBoard: boardName => {
        return new Promise((resolve, reject) => {
            trello
                .createBoard(boardName)
                .then(({ data }) => {
                    resolve(data.id);
                })
                .catch(error => {
                    console.error("error to create trello board");
                    reject(error);
                });
        });
    }
};
