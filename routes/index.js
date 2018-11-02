var express = require('express');
var router = express.Router();
var fs = require('fs');

var gameData = {
    currentLocation : "testlocation",
    flags : {
        
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/turn', function(req, res, next) {
    console.log("In Turn Route");
    var location = req.query.location;
    var command = req.query.command;
    
    console.log("location: " + location + ", command: " + command);
    
    var results = {response : "Unrecognized command \"" + command + "\""};
    fs.readFile(__dirname + '/turnInfo.json', function(err, data) {
        if (err) throw err;
        var parsed_json = JSON.parse(data);
        
        if (parsed_json[location]) {
            if (parsed_json[location][command]) {
                var success = true;
                var missingRequirements = [];
                for (var requirement in parsed_json[location][command].requirements) {
                    if (parsed_json[location].hasOwnProperty(requirement)) {
                        if (!gameData.flags.hasOwnProperty(requirement)) {
                            success = false;
                            missingRequirements.push(requirement);
                        }
                        else if (gameData.flags[requirement] != parsed_json[location][command].requirements[requirement]) {
                            success = false;
                            missingRequirements.push(requirement);
                        }
                    }
                }
                
                
                if (success) {
                    for (var flag in parsed_json[location][command].setFlags) {
                        gameData.flags[flag] = parsed_json[location][command].setFlags[flag];
                    }
                    
                    results = {response : parsed_json[location][command].response};
                    if (parsed_json[location][command].hasOwnProperty("newLocation")) {
                        results["newLocation"] = parsed_json[location][command].newLocation;
                    }
                }
                else {
                    results = {response : "Missing Requirements: " + missingRequirements};
                }
            }
        }
        res.status(200).json(results);
    });
});

router.get('/newLocation', function(req, res, next) {
    console.log("In newLocation route");
    var newLocation = req.query.newLocation;
    console.log("newLocation: " + newLocation);
    
    var results = {success : false, response : "Unknown location: '" + newLocation + "'"};
    fs.readFile(__dirname + '/locationInfo.json', function(err, data) {
        if (err) throw err;
        var parsed_json = JSON.parse(data);
        
        if (parsed_json[newLocation]) {
            results = {response : parsed_json[newLocation]};
        }
        
        res.status(200).json(results);
    });
});

router.get('/commands', function(req, res, next) {
    console.log("In commands route");
    var location = req.query.location;
    gameData.currentLocation = location;
    console.log("location: " + location);
    
    var results = {response : "Unknown location: '" + location + "'"};
    fs.readFile(__dirname + '/turnInfo.json', function(err, data) {
        if (err) throw err;
        var parsed_json = JSON.parse(data);
        
        if (parsed_json[location]) {
            var commands = [];
            for (var command in parsed_json[location]) {
                commands.push(command);
            }
            results.response = commands;
        }
        
        res.status(200).json(results);
    });
});

module.exports = router;