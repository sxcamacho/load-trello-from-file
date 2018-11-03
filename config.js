require("dotenv").config();

const FILE_PATH = "./data/discography.txt";
const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_NAME = "Bob Dylan";

module.exports = {
    FILE_PATH,
    TRELLO_KEY,
    TRELLO_TOKEN,
    BOARD_NAME
};
