const electron = require('electron');

const {app} = electron;
const {BrowserWindow} = electron;
const {ipcMain} = electron;

require('./server');

let window;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL(`file://${__dirname}/index.html`);

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
SongImport.getSongData("/Users/hlewis/Music/iTunes/iTunes Media/Music/Rihanna/Loud/01\ S&M.m4a");
