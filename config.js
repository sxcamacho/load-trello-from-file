require("dotenv").config();

const FILE_PATH = "./data/discography.txt";
const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const ARTIST_NAME = "Bob Dylan";
const API_TRELLO_URL = "https://api.trello.com/1";
const API_SPOTIFY_URL = "https://api.spotify.com/v1";
const API_SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com/api";

module.exports = {
    FILE_PATH,
    TRELLO_KEY,
    TRELLO_TOKEN,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    ARTIST_NAME,
    API_TRELLO_URL,
    API_SPOTIFY_URL,
    API_SPOTIFY_ACCOUNTS_URL
};
