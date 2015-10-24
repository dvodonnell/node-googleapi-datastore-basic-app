//node-googleapi-datastore-basic-app
//GPL 3.0

/*
The only thing needed to get this to 'work' is for you to modify config.json with your project info.
But you'll probably want a little more than this, e.g. some semblance of data security.
 */

var workingPath = __dirname;

//load in config
var config = require( workingPath + '/config.json');

if (config) {

    var creds = require(workingPath + '/' + config.paths.credentials);

    var DSInterface = require('./lib/datastore-interface'),
        Express = require('express'),
        googleapis = require('googleapis');

    var app = Express(),
        ds = new DSInterface(googleapis);

    ds.setProjectID(config.projectId);
    ds.setCredentials(creds);

    ds.authorize(function(){

        //*really* rudimentary routing

        var bodyParser = require('body-parser')
        app.use( bodyParser.json() );

        app.get(/([A-Za-z])+(\/[a-zA-Z0-9\-])*/, function(req, res){

            var parts = req.url.split('/');
            parts.shift();

            var filter = null;

            if (parts[1]) {
                filter = JSON.parse(parts[1]);
            }

            ds.query(parts[0], filter, function(err, resp){
                res.setHeader('Content-Type', 'application/json');
                if (err) {
                    res.send(err);
                } else {
                    res.send(resp);
                }
            });

        });

        app.post(/([A-Za-z])+/, function(req, res){

            var parts = req.url.split('/');
            parts.shift();

            var postData = req.body;

            ds.insert(parts[0], postData, function(err, resp){
                res.setHeader('Content-Type', 'application/json');
                if (err) {
                    res.send(err);
                } else {
                    res.send(resp);
                }
            });

        });

        app.listen(config.server.port);

    }, function(jwtErr) {
        console.log(jwtErr)
    });

} else {

    console.log('No config file found. Rename config.json.sample and put in your project info.');

}