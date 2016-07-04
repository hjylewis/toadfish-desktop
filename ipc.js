const {ipcMain} = require('electron');
var request = require('request');

var SongImport = require('./lib/songImport');
var songImport = new SongImport();
songImport.importSongs("/Users/hlewis/Music/iTunes/iTunes Media/Music/");

ipcMain.on('song', (event, path) => {
  SongImport.getSongData(path, (err, data) => {
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

ipcMain.on('storeSongs', (event, data) => {
  console.log(data);
  songImport.getMetadata((err, songData) => {
    if (err) {
      console.log(err);
      return;
    }
    // TODO redo and make secure
    songData.forEach((song) => {
      request.post({
          url:'http://localhost:8000/localsong/' + data.roomID + '/storeSongs',
          form: {
            song: JSON.stringify(song)
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