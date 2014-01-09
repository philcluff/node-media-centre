// Load in modules
var restify = require('restify');
var url = require('url');
var exec = require('child_process').exec,
    child;

// Configuration loaded from ENV
var player = process.env.OMX_PLAYER;

// Global state
var requests = 0;
var playing = 0;

// Start the Media player given a file URL
var startPlayer = function(fileUrl) {

    var command = player + ' ' + fileUrl;
    console.log(command);
    child = exec(command, function(err, stdout, stderr) {
	    if (err) throw err;
	    else {
		// When the child process returns, we can mark the player as stopped.
		console.log("Player child returned!");
		playing = 0;
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
	console.log("Something else is already playing. Wait for it to finish first.");
	res.send(500, "Playback in progress, come back later.");
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