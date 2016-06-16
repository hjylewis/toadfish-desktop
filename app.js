const {ipcRenderer} = require('electron');

ipcRenderer.on('pong', (event) => {
  console.log('pong');
});
ipcRenderer.send('ping');
