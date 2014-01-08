var restify = require('restify');
var ps = require('ps-node');
var url = require('url');
var exec = require('child_process').exec,
    child;

var requests = 0;
var playing = 0;

// Start the Media player given a file URL
var startPlayer = function(fileUrl) {

    var command = 'ls -Alh /Users/philc; sleep 5;';
    var child = exec(command, function(err, stdout, stderr) {
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
	startPlayer();
	res.send(201, "Playback Started.");
    }
    else {
	console.log("Something else is already playing. Wait for it to finish first.");
	res.send(500, "Playback in progress, come back later.");
    }
}

var server = restify.createServer();

server.use(restify.bodyParser());
server.post('/api/player/play', play);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});