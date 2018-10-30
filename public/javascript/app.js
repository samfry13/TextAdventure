$(document).ready(function() {
    $('#answer').focus();

    var location = "testlocation"

    updateLocation(location);
    getCommands(location);

    function updateLocation(newLocation) {
        var url = '/newLocation?newLocation=';
        url += newLocation;
        $.getJSON(url, function(data) {
            $('#prompt').text(data.response);
        });
    }

    function getCommands(location) {
        var url = '/commands?location=' + location;
        $.getJSON(url, function(data) {
            var everything = "<ul>";
            for (var i = 0; i < data.response.length; i++) {
                everything += "<li>" + data.response[i] +"</li>";
            }
            everything += "</ul>";
            $('#choices').html(everything);
        })
    }

    function turn(command, location) {
        var url = '/turn?command=' + command + "&location=" + location;
        $.getJSON(url, function(data) {
            console.log(data);
        }) 
    }

    $(document).keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            turn($('#answer').val(), location);
            $('#answer').val("");
        }
    })
});