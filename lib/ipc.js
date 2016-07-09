const {ipcMain} = require('electron');
var request = require('request');
var signature = require('cookie-signature');
var LocalSongFrame = require('toadfish-frame');

module.exports = function (songImport) {
  // Add song file path to import
  ipcMain.on('addPath', (event, path) => {
    songImport.importSongs(path, (err, newSongs) => {
      if (!err) {
        event.sender.send('libraryCount', songImport.songs.size);
      }
    });
  });

  ipcMain.on('importFromFile', (event) => {
    songImport.importFromFile((err) => {
      event.sender.send('libraryCount', songImport.songs.size);
    });
  });

  ipcMain.on('requestLibraryCount', (event) => {
    event.sender.send('libraryCount', songImport.songs.size);
  });

  ipcMain.on('clearLibrary', (event) => {
    songImport.clearSongs();
    event.sender.send('libraryCount', songImport.songs.size);
  });

  // Get song data
  ipcMain.on('song', (event, path) => {
    songImport.getSongData(path, (err, data) => {
      if (err) {
        event.sender.send('song', {
          err: err
        });
      } else {
        event.sender.send('song', {
          confirmPath: path,
          song: data
        });
      }
    })
  });

  // Request to store songs
  ipcMain.on('storeSongs', (event, data) => {
    console.log(data);
    var cookie = 'connect.sid=s:' + signature.sign(data.sessionID, process.env.SESSION_SECRET);
    songImport.getMetadata((err, songData) => {
      if (err) {
        console.log(err);
        return;
      }
      songData.forEach((song) => {
        var frame = new LocalSongFrame(song.meta, song.image).toFrame();
        frame.pipe(request.post({
          url:'http://localhost:8000/localsong/' + data.roomID + '/storeSongs',
          headers: {
            'Cookie': cookie
          }
        }, (err, httpResponse, body) => {
          if (err) {
            console.log(err);
          }
          console.log(httpResponse.statusCode);
          console.log(body);
        }));
      });
      event.sender.send('localEnabled');
    })
  })
};
