var async = require('async'),
	Location = Utils.getModel('Location'),
	Flight = Utils.getModel('Flight'),
	express = require('express'),
	flightsRouter = express.Router();


//====================================================================
flightsRouter.get('/origins', function(req, res, next) {

	//Sanitize query

	var query = req.query.to? {_destination: req.query.to.trim()} : {};

	Flight
		.find(query)
		.distinct('_origin')
		.exec((err, origins) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: origins});
		});
});

//====================================================================
flightsRouter.get('/destinations', function(req, res, next) {

	//Sanitize query

	var query = req.query.from? {_origin: req.query.from.trim()} : {};

	Flight
		.find(query)
		.distinct('_destination')
		.exec((err, destinations) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: destinations});
		});
});

//====================================================================
flightsRouter.get('/:id', function(req, res, next) {

	var flightId = req.params.id.trim();

	Flight
		.findById(flightId)
		.exec(function(err, result) {

			if (err) return next(err);
			if (!result) return res.status(404).json({status: 404, message: 'Can\'t find any flight with provided id'});
			res.status(200).json({status: 200, message: 'OK', result: result});
		});
});

//====================================================================
flightsRouter.post('/', function(req, res, next) {

	async.waterfall([
		function(callback) {
			Location
				.findById(req.body.origin.toUpperCase())
				.exec(function(err, result) {
					if (err) return callback(err);

					if (!result) 
						callback({message: "origin not found"})
					else 
						callback(null);
				})
		},
		function(callback) {
			Location
				.findById(req.body.destination.toUpperCase())
				.exec(function(err, result) {
					if (err) return callback(err);

					if (!result)
						callback({message: "destination not found"})
					else
						callback(null);
				})
		}
	], 
	function(err) {

		if (err) return next(err);

		var flight = new Flight({
			_id: req.body.id,
			_origin: req.body.origin,
			_destination: req.body.destination,
		    departure: req.body.departure,
		    arrival: req.body.arrival,
		    seats: req.body.seats
		});

		flight.save(function(err) {
			if (err) return next(err);

			res.status(200).json({
				message: 'saved', 
				location: '/api/flights/' + flight._id
			});
		})
	})
	
});


//====================================================================
module.exports = flightsRouter;