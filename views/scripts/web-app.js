(function () {
  var dev = process.env.ENV === "dev";

  // Set continue button destination
  var roomID = location.search.substring(1);
  console.log(roomID);
  var webApp = document.getElementById('web-app');
  if (dev) {
    webApp.setAttribute('src','http://localhost:8000/' + roomID);
  } else {
    webApp.setAttribute('src','http://toadfish.xyz' + roomID);
  }

  webApp.addEventListener('ipc-message', (event) => {
    if (event.channel === "loadLocalSongs") {
      roomID = event.args[0];
      window.location.href = `./library.html?${roomID}`
    }
  });

  webApp.addEventListener('dom-ready', () => {
    webApp.openDevTools();
  });
})();
