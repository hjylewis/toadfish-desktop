"use strict";

var library = (function () {
  var {ipcRenderer} = require('electron');
  var dev = process.env.ENV === "dev";


  // Set continue button destination
  var continueBtn = document.getElementById('continue-btn');
  if (dev) {
    continueBtn.setAttribute('href','http://localhost:8000');
  } else {
    continueBtn.setAttribute('href','http://toadfish.xyz');
  }

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
    countEl.appendChild(document.createTextNode(count.toString()));
  });

  function handleFiles(files) {
    var path = files[0].path;
    console.log(path);
    ipcRenderer.send('addPath', path);
  }

  return {
    handleFiles: handleFiles
  }
})();
