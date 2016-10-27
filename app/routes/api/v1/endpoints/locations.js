var Location = Utils.getModel('Location').Model,
	Flight = Utils.getModel('Flight').Model,
	express = require('express'),
	locationsRouter = express.Router();

//====================================================================
locationsRouter.get('/origins', function(req, res, next) {

	//Sanitize query

	var query = req.query.to? {_destination: req.query.to.trim()} : {};

	Flight
		.find(query)
		.distinct('_origin')
		.exec((err, originIds) => {

			if (err) return next(err);

			Location
				.find({'_id': {$in: originIds}})
				.exec((err, origins) => {

					if (err) return next(err);
					res.status(200).json({status: 200, message: 'OK', result: origins});
				});			
		});
});

//====================================================================
locationsRouter.get('/destinations', function(req, res, next) {

	//Sanitize query

	var query = req.query.from? {_origin: req.query.from.trim()} : {};

	Flight
		.find(query)
		.distinct('_destination')
		.exec((err, destinationIds) => {

			if (err) return next(err);

			Location
				.find({'_id': {$in: destinationIds}})
				.exec((err, destinations) => {

					if (err) return next(err);
					res.status(200).json({status: 200, message: 'OK', result: destinations});
				});
		});
});

//====================================================================
locationsRouter.get('/:id', function(req, res, next) {

	var locationId = req.params.id.trim();

	Location
		.findById(locationId)
		.exec((err, location) => {

			if (err) return next(err);
			if (!location) return res.status(404).json({status: 404, message: 'Can\'t find any location with provided id'});
			res.status(200).json({status: 200, message: 'OK', result: location});
		});
});

//====================================================================
locationsRouter.get('/', function(req, res, next) {

	var query = req.query.region? {region: req.query.region.trim()} : {};

	Location
		.find(query)
		.exec((err, locations) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: locations});
		});
});

//====================================================================
locationsRouter.put('/:id', function(req, res, next) {

	var locationId = req.params.id.trim();

	Location
		.findById(locationId)
		.exec((err, location) => {

			if (err) return next(err);
			if (location) {

				location.name = req.body.name;
				location.region = req.body.region;

			} else {

				location = new Location({
					_id: locationId,
					name: req.body.name,
					region: req.body.region
				});
			}

			location.save((err) => {

				if (err) return next(err);
				res.status(200).json({status: 200, message: 'OK', result: '/api/locations/' + locationId});
			})
			
		});
});

//====================================================================
module.exports = locationsRouter;