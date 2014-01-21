// FIXME: Nasty hack for now to save cycles clearing the last browsed item in the lists
var lastShowId;
var lastSeriesId;

// Helpers to show loading spinner
function loading() {
    $( "#loading" ).append('<img src="images/ajax-loader.gif" />');
}
function doneLoading() {
    // FIXME - Shouldn't really be here. But works nicely here
    // JQuery for hovering over list items...
    $( "li" ).hover(
	function() {
	    $( this ).addClass( "highlighted" );
	}, function() {
	    $( this ).removeClass( "highlighted" );
	}
    );

    $( "#loading" ).text("");
}

// Raw pause call to the player
function pause() {
    $.ajax({
	    url : '/api/player/pause',
	    type : 'POST'
	    });
}

// Raw stop call to the player
function stop() {
    $.ajax({
	    url : '/api/player/stop',
	    type : 'POST'
	    });
}

// Load the root directory (Actually TVShows for now!)
function loadRoot() {
    loading();
    var jqxhr = $.getJSON( "/api/media/tvshows", function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
            items.push('<li onclick="loadSeriesList(this.id)" id="' + data[i].attributes.ratingKey  + '">' + data[i].attributes.title + '</li>');
        }
        $( "#show" ).append(items.join( "" ));

	doneLoading();
    });
}

// Load the Series List
function loadSeriesList(key) {
    loading();
    $( '#'+key ).addClass( "selected" );
    $( '#'+lastShowId ).removeClass( "selected" );
    lastShowId = key;
    $( "#series" ).empty();
    $( "#episode" ).empty();
    console.log("Click: " + key);
    var jqxhr = $.getJSON( "/api/media/children/" + key, function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
	    if (data[i].attributes.ratingKey) { // Trim out anything that doesn't have a true chid element. EG: "All Episodes"
		items.push('<li onclick="loadEpisodeList(this.id)" id="' + data[i].attributes.ratingKey  + '">' + data[i].attributes.title + '</li>');
	    }
        }
        $( "#series" ).append(items.join( "" ));
	doneLoading();
    });
}

// Load the Episode List
function loadEpisodeList(key) {
    loading();
    $( '#'+key ).addClass( "selected" );
    $( '#'+lastSeriesId ).removeClass( "selected" );
    lastSeriesId = key;
    $( "#episode" ).empty();
    console.log("Click: " + key);
    var jqxhr = $.getJSON( "/api/media/children/" + key, function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
	    if (data[i].attributes.ratingKey) {
		if (data[i].attributes.viewCount) {
		    // Watched
		    items.push('<li class="epwatched" onclick="play(this.id, ' + data[i].attributes.ratingKey + ')" id="' + data[i].media[0].part[0].attributes.id  + '">' + data[i].attributes.title + '</li>');
		}
		else {
		    // Unwatched
		    items.push('<li onclick="play(this.id, '  + data[i].attributes.ratingKey + ')" id="' + data[i].media[0].part[0].attributes.id  + '">' + data[i].attributes.title + '</li>');
		}
	    }
        }
        $( "#episode" ).append(items.join( "" ));
	doneLoading();
    });
}

// Play a file
function play(mediaKey, epKey) {

    $( "#" + mediaKey ).addClass( "epwatched" );

    // This logic doesn't belong here. What's returned by the plex api shoudl be a full URL really.
    // This could be added in our wrapper around plex-api.
    var playPath = 'http://yoshi:32400/library/parts/' + mediaKey +'/file.mkv';
    $.ajax({
	   url : '/api/player/play',
	   data : JSON.stringify({ 'url' : playPath }),
	   contentType : 'application/json',
	   type : 'POST',
	   });

    // TODO: Should we bother checking for a 200 here, and update make the play count call accordingly?
    $.ajax({
	   url : '/api/media/watched/' + epKey,
	   contentType : 'application/json',
	   type : 'POST',
	   });
    
}

// For future development...
// Listens for keys to be pressed...
function keyListener() {
    $("body").keydown(function(e) {
        $( "#last-key" ).text("Last Key: " + e.which);
        console.log(e.which);
        if(e.which == 37) {
        }
        else if(e.which == 39) {
        }
    });
}
