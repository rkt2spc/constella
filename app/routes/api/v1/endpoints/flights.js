var async = require('async'),
	Location = Utils.getModel('Location').Model,
	Flight = Utils.getModel('Flight').Model,
	express = require('express'),
	flightsRouter = express.Router();

//====================================================================
flightsRouter.get('/', function(req, res, next) {

	var query = {};
	if (req.query.departure) {

		var start = new Date(Number(req.query.departure)),
			end = new Date(start.getTime());
		
		end.setDate(end.getDate() + 1);

		if (end < new Date())
			return res.status(400).json({status: 400, message: 'Invalid flight schedule'});

		query['schedule.departure'] = { '$gte': start, '$lt': end };
	}
	if (req.query.origin) query._origin = req.query.origin;
	if (req.query.destination) query._destination = req.query.destination;

	Flight
		.find(query)
		.exec((err, results) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: results});
		});
});

//====================================================================
flightsRouter.get('/:id', function(req, res, next) {

	var flightId = req.params.id.trim();

	Flight
		.findById(flightId)
		.exec((err, result) => {

			if (err) return next(err);
			if (!result) return res.status(404).json({status: 404, message: 'Can\'t find any flight with provided id'});
			res.status(200).json({status: 200, message: 'OK', result: result});
		});
});

//====================================================================
//Should remove later
flightsRouter.put('/:id', function(req, res, next) {

	var flightId = req.params.id.trim();

	async.waterfall([
		function(callback) {
			Location
				.findById(req.body.origin.trim())
				.exec((err, result) => {

					if (err) return callback(err);
					if (!result) return callback({message: "origin not found"})
					callback(null);
				})
		},
		function(callback) {
			Location
				.findById(req.body.destination.trim())
				.exec((err, result) => {

					if (err) return callback(err);
					if (!result) return callback({message: "destination not found"})
					callback(null);
				})
		},
		function(callback) {
			Flight
				.findById(flightId)
				.exec((err, result) => {

					if (err) return callback(err);
					callback(null, result);
				})
		}
	], 
	function(err, flight) {

		if (err) return next(err);

		if (!flight) {

			flight = new Flight({
				_id: flightId,
				_origin: req.body.origin.trim(),
				_destination: req.body.destination.trim(),
				schedule: {
					departure: new Date(Number(req.body.departure)),
			    	arrival: new Date(Number(req.body.arrival))
				},
				seats: req.body.seats
			});
		
		} else {

			flight._origin = req.body.origin.trim();
			flight._destination = req.body.destination.trim();

			flight.schedule = {
				departure: new Date(Number(req.body.departure)),
			    arrival: new Date(Number(req.body.arrival))
			};
			flight.markModified('schedule');

			flight.seats = req.body.seats;
			flight.markModified('seats');
		}

		flight.save((err) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: '/api/flights/' + flightId});
		});
	})
	
});


//====================================================================
module.exports = flightsRouter;