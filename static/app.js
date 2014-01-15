function loadRoot() {
    $( "#loading" ).text("Loading...");
    var jqxhr = $.getJSON( "/api/media/tvshows", function(data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
            items.push("<li onclick=\"loadSeriesList(this.id)\" id=\"" + data[i].attributes.key  + "\">" + data[i].attributes.title + "</li>");
        }
        $( "#show" ).append(items.join( "" ));
        $( "#loading" ).text("");
    });
}

function loadSeriesList(key) {
    console.log("Click: " + key);
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