var restify = require('restify');
var mediaPlayer = require("media-player");

// Startup REST server and setup request mappings
var server = restify.createServer();

server.use(restify.bodyParser());
server.post('/api/player/play', mediaPlayer.play);
server.post('/api/player/stop', mediaPlayer.stop);
server.post('/api/player/pause', mediaPlayer.pause);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});