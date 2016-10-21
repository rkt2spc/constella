var async = require('async'),
	Region = Utils.getModel('Region'),
	Location = Utils.getModel('Location'),
	Flight = Utils.getModel('Flight'),
	express = require('express'),
	locationsRouter = express.Router();

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

	var query = req.params.region? {_region: req.params.region.trim()} : {};

	Location
		.find(query)
		.exec((err, locations) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: locations});
		});
});

locationsRouter.post('/', function(req, res, next) {

	var regionId = req.body.region.trim();

	Region
		.findById(regionId)
		.exec((err, region) => {

			if (err) return next(err);
			if (!region) return res.status(400).json({status: 400, message: "Invalid provided region"});
			
			var location = new Location({
				_id: req.body.id,
				name: req.body.name,
				_region: regionId
			});

			location.save((err) => {

				if (err) return next(err);
				res.status(200).json({status: 200, message: "Saved", result: "/api/locations/" + location._id});
			});		
		});
});

//====================================================================
module.exports = locationsRouter;