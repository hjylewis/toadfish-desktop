"use strict";

var library = (function () {
  var {ipcRenderer} = require('electron');
  var dev = process.env.ENV === "dev";

  var roomID = location.search.substring(1);
  console.log(roomID);
  var continueBtn = document.getElementById('continue-btn');
  continueBtn.setAttribute('href', './web-app.html?' + roomID);

  // Set up drag and drop
  var form = document.getElementById('library-form');
  form.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  })

  form.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
  })

  form.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  });

  var countEl = document.getElementById('count');
  ipcRenderer.on('libraryCount', (e, count) => {
    countEl.innerHTML = '';  //reset
    countEl.appendChild(document.createTextNode(count));
  });

  var clear = document.getElementById('clear-btn');
  clear.addEventListener('click', (e) => {
    ipcRenderer.send('clearLibrary');
    e.preventDefault();
  });

  function handleFiles(files) {
    var path = files[0].path;
    console.log(path);
    ipcRenderer.send('addPath', path);
  }

  ipcRenderer.send('importFromFile');
  return {
    handleFiles: handleFiles
  }
})();
