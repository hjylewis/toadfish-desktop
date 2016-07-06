const {ipcMain} = require('electron');
var request = require('request');
var signature = require('cookie-signature');

module.exports = function (songImport) {
  // Add song file path to import
  ipcMain.on('addPath', (event, path) => {
    songImport.importSongs(path, (err, newSongs) => {
      if (!err) {
        songImport.getMetadata((err, songs) => {
          if (!err) {
            event.sender.send('libraryCount', songs.length);
          }
        });
      }
    });
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
      // TODO redo
      songData.forEach((song) => {
        request.post({
            url:'http://localhost:8000/localsong/' + data.roomID + '/storeSongs',
            form: {
              song: JSON.stringify(song)
            },
            headers: {
              'Cookie': cookie
            }
          },
          (err, httpResponse, body) => {
            if (err) {
              console.log(err);
            }
            console.log(httpResponse.statusCode);
            console.log(body);
            event.sender.send('localEnabled');
          });
      });
    })
  })
};
