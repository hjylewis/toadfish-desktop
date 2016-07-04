"use strict";

var fs = require('fs');
var async = require('async');
var path = require('path');
var mm = require('musicmetadata');
var _ = require('underscore');

const formats = ['.mp3','.mp4','.m4a','.acc'];

var _isMusic = (file) => formats.indexOf(path.extname(file)) >= 0;

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

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
          var meta = _.pick(data, 'album', 'artist','genre','title','year');
          meta.path = song;
          metadata.push(meta);
          callback();
        }
      });
    }, (err) => callback(err, metadata));
  }

  static getSongData(path, callback) {
    fs.readFile(path, (err, data) => {
      if (err) {
        callback(err);
      } else {
        callback(null, new Uint8Array(data))
      }
    });
  }
}

module.exports = SongImport;
