const electron = require('electron');

const {app} = electron;
const {BrowserWindow} = electron;

require('./ipc');

let window;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
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
