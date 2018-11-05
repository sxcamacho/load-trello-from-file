const axios = require("axios");
const config = require("../config.js");

let SPOTIFY_TOKEN = undefined;
const pageLimit = 50;

getHeader = () => {
    return {
        headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
    };
};

var self = (module.exports = {
    getToken: () => {
        const client_credentials = Buffer.from(
            `${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64");

        return new Promise((resolve, reject) => {
            axios
                .post(
                    `${config.API_SPOTIFY_ACCOUNTS_URL}/token`,
                    "grant_type=client_credentials",
                    {
                        headers: {
                            Authorization: `Basic ${client_credentials}`,
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(({ data }) => {
                    SPOTIFY_TOKEN = data.access_token;
                    resolve(SPOTIFY_TOKEN);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    getArtist: artist => {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    `${config.API_SPOTIFY_URL}/search?q=${artist}&type=artist`,
                    getHeader()
                )
                .then(({ data }) => {
                    resolve(data.artists.items[0].id);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    getAlbums: (artistId, page, result) => {
        page = page ? page : 0;
        result = result ? result : [];

        var params = `offset=${pageLimit * page}&limit=${pageLimit}`;

        return new Promise((resolve, reject) => {
            let apiUrl = `${API_SPOTIFY_URL}/artists/${artistId}/albums?${params}`;
            axios
                .get(apiUrl, getHeader())
                .then(({ data }) => {
                    let newResult = result;
                    if (data.items.length > 0) {
                        newResult = newResult.concat(data.items);
                    }
                    if (data.next) {
                        resolve(self.getAlbums(artistId, page + 1, newResult));
                    } else {
                        resolve(newResult);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
});
