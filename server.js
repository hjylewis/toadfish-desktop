const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  res.end("Hello, World");
  console.log(url.parse(req.url));
  console.log(req.method);
});

server.listen(8000);

// ## Notes
// Site - Desktop Handshake
// Site ask for paths and metadata
//    Stores in db
// Site asks for song file

// Desktop tells Site there are new songs

// Desktop should store paths in persistant storage and check if still there on restart.
