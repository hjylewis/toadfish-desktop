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


  function handleFiles(files) {
    var path = files[0].path;
    console.log(path);
    ipcRenderer.send('addPath', path);
  }

  return {
    handleFiles: handleFiles
  }
})();
