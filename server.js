// Load in modules
var restify = require('restify');
var url = require('url');
var exec = require('child_process').exec,
    child; // Note that child is replaced every time a player is spawned.
// Used for tracking the player exit events
var events = require('events');
var emitter = new events.EventEmitter();

// Configuration loaded from ENV
var player = process.env.OMX_PLAYER;

// Global state
var requests = 0;
var playing = 0;

// Start the Media player given a file URL
function startPlayer(fileUrl) {

    var command = player + ' ' + fileUrl;
    console.log(command);
    child = exec(command, function(err, stdout, stderr) {
	    if (err) throw err;
	    else {
		// When the child process returns, we can mark the player as stopped.
		console.log("Player child returned!");
		playing = 0;
		emitter.emit('playbackEnd');
	    }
	});

    // Potential race condition if the player returns quicky from the exec above.
    playing = 1;
};

// Play API call
function play(req, res, next) {

    requests++;
    console.log('Got request to play url: ' +  req.body.url);
    console.log('Request ID: ' + requests);

    if (playing === 0) {
	startPlayer(req.body.url);
	res.send(201, "Playback Started.");
    }
    else {
	    // Register event listener for the child process, containing next URL
	    emitter.once('playbackEnd', function () {
		console.log('Event handler fired.');
		startPlayer(req.body.url);
	    });

	child.stdin.write('q');
	res.send(201, "Changed Video.");
    }
}

// Stop API call
function stop(req, res, next) {

    requests++;
    console.log('Got request to stop!');
    console.log('Request ID: ' + requests);

    if (playing === 1) {
	child.stdin.write('q');
	res.send(200, "Playback Stopped.");
    }
    else {
	console.log("Not playing");
	res.send(200, "Not playing anything.");
    }
}

// Stop API call
function pause(req, res, next) {

    requests++;
    console.log('Got request to pause!');
    console.log('Request ID: ' + requests);

    if (playing === 1) {
	child.stdin.write('p');
	res.send(200, "Playback paused/unpaused.");
    }
    else {
	console.log("Not playing");
	res.send(200, "Not playing anything.");
    }
}

// Startup REST server and setup request mappings
var server = restify.createServer();

server.use(restify.bodyParser());
server.post('/api/player/play', play);
server.post('/api/player/stop', stop);
server.post('/api/player/pause', pause);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});