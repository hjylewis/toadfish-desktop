const electron = require('electron');

const {app} = electron;
const {BrowserWindow} = electron;

const ipc = require('./lib/ipc');

let window;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL(`file://${__dirname}/views/library.html`);


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

var SongImport = require('./lib/songImport');
var songImport = new SongImport();
ipc(songImport);

// TODO
// Remove local song view from web
// Add view to desktop
// Make song meta adding more fast
// Add persist storage
// Photos
// music stops when loading more songs
