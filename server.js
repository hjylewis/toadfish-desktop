"use strict";

const http = require('http');
const Router = require('./lib/router');


var router = new Router();
router.addPath('/ping', (req, res) => {
  res.end("pong");
});

router.addPath('/song', (req, res) => {
  res.end("song data");
});

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(8000);

// ## Notes
// Site - Desktop Handshake
// Site ask for paths and metadata
//    Stores in db
// Site asks for song file

// Desktop tells Site there are new songs

// Desktop should store paths in persistant storage and check if still there on restart.
