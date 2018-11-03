const trello = require("./lib/trello.js");

getMe = () => {
    trello
        .getInfoAccount()
        .then(({ data }) => {
            var accountName = data.fullName ? data.fullName : data.username;
            console.log(`connected to ${accountName}'s trello account`);
        })
        .catch(error => {
            console.error("error to connect with trello");
            console.error(error);
            process.exit(0);
        });
};

module.exports = {
    getMe
};
