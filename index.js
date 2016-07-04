const electron = require('electron');

const {app} = electron;
const {BrowserWindow} = electron;
const {ipcMain} = electron;

var request = require('request');

let window;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    // win.loadURL(`file://${__dirname}/index.html`);
    if (process.env.ENV === "dev") {
      win.loadURL(`http://localhost:8000`);
    } else {
      win.loadURL(`http://toadfish.xyz`);
    }


    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('ping', (event) => {
  console.log('ping');
  event.sender.send('pong');
});

var SongImport = require('./lib/songImport');
var songImport = new SongImport();
songImport.importSongs("/Users/hlewis/Music/iTunes/iTunes Media/Music/Rihanna/Loud/01\ S&M.m4a");

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

// var SongImport = require('./lib/songImport');
// SongImport.getSongData("/Users/hlewis/Music/iTunes/iTunes Media/Music/Rihanna/Loud/01\ S&M.m4a");
