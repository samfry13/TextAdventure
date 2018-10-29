var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/turn', function(req, res, next) {
    console.log("In Turn Route");
    var location = req.query.location;
    var command = req.query.command;
    
    console.log("location: " + location + ", command: " + command);
    
    var results = {response : "Unrecognized command '" + command + "' at your location"};
    fs.readFile(__dirname + '/turnInfo.json', function(err, data) {
        if (err) throw err;
        var parsed_json = JSON.parse(data);
        
        if (parsed_json[location]) {
            if (parsed_json[location][command]) {
                results = {response : parsed_json[location][command]};
            }
        }
        res.status(200).json(results);
    });
});

router.get('/newLocation', function(req, res, next) {
    console.log("In newLocation route");
    var newLocation = req.query.newLocation;
    console.log("newLocation: " + newLocation);
    
    var results = {response : "Unknown location: '" + newLocation + "'"};
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