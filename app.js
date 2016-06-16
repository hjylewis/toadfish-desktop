var SongImport = require('./lib/songImport');

var path_name = "/Users/hlewis/Music/iTunes/iTunes Media/Music";
var path2 = "/Users/hlewis/Music/iTunes/iTunes Media/Music/Grimes/Art Angels/01 Laughing and Not Being Normal.m4a";


var simport = new SongImport();
simport.importSongs(path_name, (err) => {
  if (err)
    console.error(err);
  console.log(simport.songs);
});
