var should = require('chai').should();
var expect = require('chai').expect;
var SongImport = require('../lib/songImport');

// TODO make this more portable (not my file system specific)

describe('songImport', function() {
  describe('importSongs', function () {
    it('should import songs from directory without failure', function (done) {
      var songImport = new SongImport();
      var path = "/Users/hlewis/Music/iTunes/iTunes Media/Music";
      songImport.importSongs(path,done);
    });

    it('should import song without failure', function (done) {
      var songImport = new SongImport();
      var path = "/Users/hlewis/Music/iTunes/iTunes Media/Music/Grimes/Art Angels/01 Laughing and Not Being Normal.m4a";
      songImport.importSongs(path,done);
    });

    it('should fail when path is incorrect', function () {
      var songImport = new SongImport();
      var path = "/does_not_exist";
      songImport.importSongs(path,(err) => {
        expect(err).to.throw;
      });
    });

    it('should import 50 songs', function () {
      var songImport = new SongImport();
      var path = "/Users/hlewis/Music/iTunes/iTunes Media/Music";
      songImport.importSongs(path, () => {
        var num_of_songs = songImport.songs.size;
        num_of_songs.should.equal(50);
      });
    });

    it('should import 1 song', function () {
      var songImport = new SongImport();
      var path = "/Users/hlewis/Music/iTunes/iTunes Media/Music/Grimes/Art Angels/01 Laughing and Not Being Normal.m4a";
      songImport.importSongs(path, () => {
        var num_of_songs = songImport.songs.size;
        num_of_songs.should.equal(1);
      });
    });

    it('should not contain duplicates', function () {
      var songImport = new SongImport();
      var path = "/Users/hlewis/Music/iTunes/iTunes Media/Music";
      var path2 = "/Users/hlewis/Music/iTunes/iTunes Media/Music/Grimes/Art Angels/01 Laughing and Not Being Normal.m4a";
      songImport.importSongs(path, () => {
        songImport.importSongs(path2, () => {
          var num_of_songs = songImport.songs.size;
          num_of_songs.should.equal(50);
        });
      });
    });
  });
});
