var express = require('express'),
	regionsRouter = express.Router(),
	Region = Utils.getModel('Region');

//====================================================================
regionsRouter.get('/', function(req, res, next) {

	Region
		.find({})
		.exec((err, regions) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: regions});
		});
});

regionsRouter.post('/', function(req, res, next) {

	//validate body

	var region = new Region({
		_id: req.body.id.toUpperCase(),
		name: req.body.name
	});

	region.save((err) => {

		if (err) return next(err);
		res.status(200).json({status: 200, message: "Saved", result: "/api/regions/" + region._id});
	});
});

//====================================================================
regionsRouter.get('/:id', function(req, res, next) {

	var regionId = req.params.id.trim();

	Region
		.findById(regionId)
		.exec((err, region) => {

			if (err) return next(err);
			if (!region) return res.status(404).json({status: 404, message: 'Can\'t find any region with provided id'});
			res.status(200).json({status: 200, message: 'OK', result: region});
		});
});

//====================================================================
module.exports = regionsRouter;