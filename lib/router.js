"use strict";

const url = require('url');

/* Simple router class */
class Router {
  constructor () {
    this.paths = {};
  }
  addPath (path, handler) {
    this.paths[path] = handler;
  }
  handle (req, res) {
    var path = url.parse(req.url).pathname;
    if (!(path in this.paths)) {
      res.statusCode = 404;
      res.end();
      return;
    }

    this.paths[path](req, res);
  }
}

module.exports = Router;
