var restify = require('restify');
var mediaPlayer = require("media-player");
var mediaLibrary = require("plex");

// Startup REST server and setup request mappings
var server = restify.createServer({name: 'NodeMediaCenter'});

// Media Player API
server.use(restify.bodyParser());
server.post('/api/player/play', mediaPlayer.play);
server.post('/api/player/stop', mediaPlayer.stop);
server.post('/api/player/pause', mediaPlayer.pause);

// Media Library API
server.get('/api/media/tvshows', mediaLibrary.getAllTvShows);
server.get('/api/media/children/:key', mediaLibrary.getChildrenByKey);
server.post('/api/media/watched/:key', mediaLibrary.flagAsWatched); // Flag a tree as watched
server.post('/api/media/unwatched/:key', mediaLibrary.flagAsUnwatched); // Flag a tree as unwatched

// Static content (GUI)
server.get(/\/gui\/?.*/, restify.serveStatic({
	    directory: './static'
		}));

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
