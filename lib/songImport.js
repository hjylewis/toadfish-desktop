"use strict";

var fs = require('fs');
var async = require('async');
var path = require('path');

const formats = ['.mp3','.mp4','.m4a','.acc'];

var _isMusic = (file) => formats.indexOf(path.extname(file)) >= 0;

class SongImport {
  constructor() {
    this.songs = new Set();
  }

  importSongs(absPath, callback) {
    callback = callback || (() => {});
    var newSongs = new Set();
    var songs = this.songs;

    var recursive = (absPath, callback) => {
      var file = path.basename(absPath);
      var stats;

      // If incorrect path
      try {
        stats = fs.lstatSync(absPath);
      } catch (e) {
        return callback(e);
      }

      if (stats.isFile() && _isMusic(file)) {
        newSongs.add(absPath);
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
          recursive(newPath, callback);
        }, (err) => {
          callback(err);
        })
      });
    }

    recursive(absPath, (err) => {
      if (err) {
        return callback(err);
      }
      for (var song of newSongs) {
        if (songs.has(song)) {
          newSongs.delete(song);
        } else {
          songs.add(song);
        }
      }
      callback(null, newSongs);
    });
  }
}

module.exports = SongImport;
