var path = require('path'),
	http = require('http');
//------------------------------------------------------------------------
var express = require('express'),
	morgan = require('morgan'),
    bodyParser = require('body-parser'),
    passport = require('passport');

const constant = require("../app/models/Const/siteconst");
var app = express();

//------------------------------------------------------------------------
global.Utils = require('./utilities');
global.App = {
    app:    app,
    env:    process.env.NODE_ENV || 'development',
    port:   process.env.PORT || 1337,
    secret: process.env.SERECT || constant.SECRET
};

//------------------------------------------------------------------------
var config = {
        database:           Utils.getConfig('database'),
        passport:           Utils.getConfig('passport'),
        routing:            Utils.getConfig('routing'),
        errorHandling: 		Utils.getConfig('errorHandling')
    };

//------------------------------------------------------------------------
app.use(morgan('dev'));
app.use(express.static(path.join(Utils.root_path, 'public', 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(config.routing.appRouter);
app.use(config.errorHandling.handler);


//------------------------------------------------------------------------
module.exports = {
	start: function() {

        config.database.connect(config.database.connectionString, function(err) {

            if (err) return;

            http.createServer(app).listen(App.port, function() {
                console.log('Server listening at port', App.port);
            });
        })

	}
};
