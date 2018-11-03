const axios = require("axios");
const config = require("../config.js");

const params = `key=${config.TRELLO_KEY}&token=${config.TRELLO_TOKEN}`;

getInfoAccount = () => {
    return axios.get(`https://api.trello.com/1/members/me?${params}`);
};

createBoard = boardName => {
    return axios.post(
        `https://api.trello.com/1/boards?${params}&name=${boardName}&defaultLists=false`
    );
};

getBoards = () => {
    return axios.get(`https://api.trello.com/1/members/me/boards?${params}`);
};

deleteBoard = boardId => {
    return axios.delete(`https://api.trello.com/1/boards/${boardId}?${params}`);
};

module.exports = {
    getInfoAccount,
    getBoards,
    createBoard
};
