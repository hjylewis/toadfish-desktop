(function () {
  var dev = process.env.ENV === "dev";

  // Set continue button destination
  var roomID = location.search;
  console.log(roomID);
  var webApp = document.getElementById('web-app');
  if (dev) {
    webApp.setAttribute('src','http://localhost:8000/' + roomID);
  } else {
    webApp.setAttribute('src','http://toadfish.xyz' + roomID);
  }
})();
