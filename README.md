# load discography from file to trello

This script was coded using NodeJS.
It's read a txt file to obtain the Bob Dylan's discography.

The script create on Trello a new board, lists and cards for each album.
Using Spotify the album cover is attached to the card.

## Installation

```bash
npm install
```

It's needed create the .env file with the following content in the root directory.

```bash
TRELLO_KEY=xxxxxx
TRELLO_TOKEN=xxxxxxxxx
SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxx
```

## Usage

```bash
node script.js
```
