/*global $*/
$(document).ready(function() {
    $('#answer').focus();

    var location = "start";

    function updateLocation(newLocation) {
        location = newLocation;
        var url = '/newLocation?newLocation=';
        url += newLocation;
        $.getJSON(url, function(data) {
            $('#prompt').text(data.response);
        });
    }

    function getCommands(location) {
        var url = '/commands?location=' + location;
        $.getJSON(url, function(data) {
            var everything = "<h6>Valid Commands:</h6><ul>";
            for (var i = 0; i < data.response.length; i++) {
                everything += "<li>" + data.response[i] +"</li>";
            }
            everything += "</ul>";
            
            $("#commandResponse").html(everything);
        });
    }

    function turn(command, location) {
        if (command != "" && location != "") {
            var url = '/turn?command=' + command + "&location=" + location;
            $.getJSON(url, function(data) {
                console.log(data);
                $("#commandResponse").text(data.response);
                if (data.hasOwnProperty("newLocation")) {
                    updateLocation(data.newLocation);
                }
            });
        }
        else {
            $("#commandResponse").text("");
        }
    }

    $(document).keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            var answer = $("#answer").val();
            if (answer == "help") {
                getCommands(location);
            }
            else {
                turn($('#answer').val(), location);
            }
            $('#answer').val("");
        }
    });
});