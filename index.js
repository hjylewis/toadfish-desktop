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
// Add view to desktop
// Add persist storage
// Clean up photos
// music stops when loading more songs
// Remove depreciated code in site
// improve git frame dependency

// Enhancement (no time)
// improve add and remove localsongs interface
