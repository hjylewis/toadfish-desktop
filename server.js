const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  res.end("Hello, World");
  console.log(url.parse(req.url));
  console.log(req.method);
});

server.listen(8000);
