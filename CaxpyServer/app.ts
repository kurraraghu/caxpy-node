/// <reference path="Scripts/typings/express/express.d.ts" />
/// <reference path="Scripts/typings/node/node.d.ts" />
/// <reference path="Scripts/typings/body-parser/body-parser.d.ts" />
/// <reference path="src/routes/Report.ts" />
"use strict";

import * as express from 'express';
import * as bodyParser from 'body-parser';
import http = require('http');
import path = require('path');

//Import Routes
//var report = require('src/routes/Report');
var DataServiceRouter=require('./src/routes/DataService') ;

const app = express();

// all environments
app.set('port', process.env.PORT || 3000);

// configure our app to use bodyParser(it let us get the json data from a POST)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// development only
if ('development' == app.get('env')) {
    //app.use(express.errorHandler());
}

app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
//app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

app.get('/report', function(req: express.Request, res: express.Response) {
    var params = req.body.params;
    var reportid = req.body.reportid;
    //ReportUtility.getReportJson(BiUtility.getReportId(reportid), params)
    //    .then(function (response) {
    //        res.status(200).json(response);
    //    }, function (error) {
    //        res.status(500).json(error);
    //    });
    res.status(200).json("success");
});

//get router
let router: express.Router= express.Router();

//DataServiceRouter(app);
DataServiceRouter(router);
//use router middleware
app.use("/data/service",router);

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.name = "404";
    next(err);
});

//create http server
var server = http.createServer(app);

//listen on provided ports
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
server.on("error", onError);//add error handler
server.on("listening", onListening);//start listening on port


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof app.get('port') === "string"
        ? "Pipe " + app.get('port')
        : "Port " + app.get('port');

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "host : " + addr.address+",  port : " + addr.port;
    console.log("Listening on " + bind);
    //debug("Listening on " + bind);
}




