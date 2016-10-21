var express = require('express');

//------------------------------------------------------------------------
var navRouter = express.Router();

navRouter.get('/', function(req, res) {
	res.redirect('/index.html');
});

//------------------------------------------------------------------------
module.exports = navRouter;