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
	    if (data[i].attributes.ratingKey) {
		items.push("<li onclick=\"loadEpisodeList(this.id)\" id=\"" + data[i].attributes.ratingKey  + "\">" + data[i].attributes.title + "</li>");
	    }
        }
        $( "#series" ).append(items.join( "" ));
	doneLoading();
    });
}

function play() {
    alert("Play!");
}

function loadEpisodeList(key) {
    loading();
    $( "#episode" ).empty();
    console.log("Click: " + key);
    var jqxhr = $.getJSON( "/api/media/children/" + key, function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
	    if (data[i].attributes.ratingKey) {
		items.push("<li onclick=\"play()\" id=\"" + data[i].attributes.ratingKey  + "\">" + data[i].attributes.title + "</li>");
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