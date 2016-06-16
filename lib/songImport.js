"use strict";

var fs = require('fs');
var async = require('async');
var path = require('path');

var formats = ['.mp3','.mp4','.m4a','.acc'];

var _isMusic = (file) => formats.indexOf(path.extname(file)) >= 0;

class SongImport {
  constructor() {
    this.songs = new Set();
  }

  importSongs(absPath, callback) {
    callback = callback || (() => {});
    var that = this;
    var stats = fs.lstatSync(absPath);
    var file = path.basename(absPath);

    if (stats.isFile() && _isMusic(file)) {
      that.songs.add(absPath);
    }

    if (!stats.isDirectory()) {
      callback();
      return;
    }

    // is a Directory
    fs.readdir(absPath, (err, files) => {
      if (err) {
        callback(err);
        return;
      }
      async.each(files, (file, callback) => {
        var newPath = absPath + '/' + file;
        that.importSongs(newPath, callback);
      }, (err) => {
        callback(err);
      })
    });
  }
}

module.exports = SongImport;
