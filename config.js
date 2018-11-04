require("dotenv").config();

const FILE_PATH = "./data/discography.txt";
const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const BOARD_NAME = "Bob Dylan";

module.exports = {
    FILE_PATH,
    TRELLO_KEY,
    TRELLO_TOKEN,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    BOARD_NAME
};
