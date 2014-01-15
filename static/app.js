function loading() {
    $( "#loading" ).text("Loading...");
}
function doneLoading() {
    $( "#loading" ).text("");
}

function loadRoot() {
    loading();
    var jqxhr = $.getJSON( "/api/media/tvshows", function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
            items.push("<li onclick=\"loadSeriesList(this.id)\" id=\"" + data[i].attributes.ratingKey  + "\">" + data[i].attributes.title + "</li>");
        }
        $( "#show" ).append(items.join( "" ));
	doneLoading();
    });
}

function loadSeriesList(key) {
    loading();
    $( "#series" ).empty();
    $( "#episode" ).empty();
    console.log("Click: " + key);
    var jqxhr = $.getJSON( "/api/media/children/" + key, function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
	    if (data[i].attributes.ratingKey) { // Trim out anything that doesn't have a true chid element. EG: "All Episodes"
		items.push("<li onclick=\"loadEpisodeList(this.id)\" id=\"" + data[i].attributes.ratingKey  + "\">" + data[i].attributes.title + "</li>");
	    }
        }
        $( "#series" ).append(items.join( "" ));
	doneLoading();
    });
}

function play(key) {

    var playPath = 'http://yoshi:32400/library/parts/' + key +'/file.mkv';
    $.ajax({
	   url : '/api/player/play',
	   data : JSON.stringify({ 'url' : playPath }),
	   contentType : 'application/json',
	   type : 'POST',
	   });
}

function loadEpisodeList(key) {
    loading();
    $( "#episode" ).empty();
    console.log("Click: " + key);
    var jqxhr = $.getJSON( "/api/media/children/" + key, function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
	    if (data[i].attributes.ratingKey) {
		items.push("<li onclick=\"play(this.id)\" id=\"" + data[i].media[0].part[0].attributes.id  + "\">" + data[i].attributes.title + "</li>");
	    }
        }
        $( "#episode" ).append(items.join( "" ));
	doneLoading();
    });
}

function keyListener() {
    $("body").keydown(function(e) {
        $( "#last-key" ).text("Last Key: " + e.which);
        console.log(e.which);
        if(e.which == 37) {
            loadRoot();
        }
        else if(e.which == 39) {
        }
    });
}