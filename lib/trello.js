const axios = require("axios");
const config = require("../config.js");

const params = `key=${config.TRELLO_KEY}&token=${config.TRELLO_TOKEN}`;

getBoards = () => {
    return axios.get(`${config.API_TRELLO_URL}/members/me/boards?${params}`);
};

deleteBoard = boardId => {
    return new Promise((resolve, reject) => {
        axios
            .delete(`${config.API_TRELLO_URL}/boards/${boardId}?${params}`)
            .then(() => {
                console.log(`board ${boardId} has been deleted.`);
                resolve();
            })
            .catch(error => {
                console.error(`We can't delete board ${boardId}.`);
                console.error(error);
                reject(error);
            });
    });
};

module.exports = {
    getMe: () => {
        return new Promise((resolve, reject) => {
            axios
                .get(`${config.API_TRELLO_URL}/members/me?${params}`)
                .then(({ data }) => {
                    var accountName = data.fullName
                        ? data.fullName
                        : data.username;
                    resolve({ name: accountName });
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    },
    createBoard: boardName => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `${
                        config.API_TRELLO_URL
                    }/boards?${params}&name=${boardName}&defaultLists=false`
                )
                .then(({ data }) => {
                    console.log(
                        `new board has been created with id ${data.id}.`
                    );
                    resolve(data.id);
                })
                .catch(error => {
                    console.error("We couldn't create board");
                    reject(error);
                });
        });
    },
    deleteBoardsWithName: boardName => {
        return new Promise((resolve, reject) => {
            getBoards()
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
    createList: (boardId, listName, order) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `${
                        config.API_TRELLO_URL
                    }/lists?${params}&name=${listName}&idBoard=${boardId}&pos=${order}`
                )
                .then(({ data }) => {
                    console.log(
                        `new list has been created with id ${data.id}.`
                    );
                    resolve(data.id);
                })
                .catch(error => {
                    console.error("We couldn't create list");
                    reject(error);
                });
        });
    },
    createCard: (listId, cardName, order) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `${
                        config.API_TRELLO_URL
                    }/cards?${params}&name=${cardName}&idList=${listId}&pos=${order}`
                )
                .then(({ data }) => {
                    console.log(
                        `new card has been created with id ${data.id}.`
                    );
                    resolve(data.id);
                })
                .catch(error => {
                    console.error("We couldn't create card " + cardName);
                    reject(error);
                });
        });
    },
    addCoverToCard: (cardId, urlCover) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `${
                        config.API_TRELLO_URL
                    }/cards/${cardId}/attachments?${params}&url=${urlCover}`
                )
                .then(({ data }) => {
                    console.log(
                        `new album cover has been attached with id ${data.id}.`
                    );
                    resolve(data.id);
                })
                .catch(error => {
                    debugger;
                    console.error("We couldn't atach cover image");
                    reject(error);
                });
        });
    }
};
