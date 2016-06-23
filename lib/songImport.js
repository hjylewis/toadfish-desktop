"use strict";

var fs = require('fs');
var async = require('async');
var path = require('path');
var mm = require('musicmetadata');

const formats = ['.mp3','.mp4','.m4a','.acc'];

var _isMusic = (file) => formats.indexOf(path.extname(file)) >= 0;

class SongImport {
  constructor() {
    this.songs = new Set();
  }

  /* Adds songs to song set, takes callback(err, newSongs) */
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

  cleanUpSongs(callback) {
    var that = this;
    async.each(this.songs, (song, callback) => {
      fs.lstat(song, (err) => {
        // If error, file no longer exists
        if (err) {
          that.songs.delete(song);
        }
        callback();
      })
    }, callback);
  }

  getMetadata(callback) {
    SongImport.getMetadata(this.songs, callback);
  }

  static getMetadata(songs, callback) {
    var metadata = [];
    async.each(songs, (song, callback) => {
      mm(fs.createReadStream(song), (err, data) => {
        if (err) {
          callback(err);
        } else {
          metadata.push(data);
          callback();
        }
      });
    }, (err) => callback(err, metadata));
  }

    static getSongData(path, callback) {
    fs.readFile(path, 'base64', (err, data) => console.log(data));
    // Might want to pipe this http://stackoverflow.com/questions/36211148/receive-large-binary-data-from-socket-in-nodejs
  }
}

module.exports = SongImport;
