var TravelClass = Utils.getModel('TravelClass').Model,
	express = require('express'),
	travelClassesRouter = express.Router();

//====================================================================
travelClassesRouter.get('/', function(req, res, next) {

	TravelClass
		.find({})
		.exec((err, results) => {

			if (err) return next(err);
			res.status(200).json({status: 200, message: 'OK', result: results});
		});
});

//====================================================================
travelClassesRouter.get('/:id', function(req, res, next) {

	var travelClassId = req.params.id.trim();

	TravelClass
		.findById(travelClassId)
		.exec((err, result) => {

			if (err) return next(err);
			if (!result) return res.status(404).json({status: 404, message: 'Can\'t find any TravelClass with provided id'});
			res.status(200).json({status: 200, message: 'OK', result: result});
		});
});

//====================================================================
//Should remove later
travelClassesRouter.put('/:id', function(req, res, next) {

	var travelClassId = req.params.id.trim();

	TravelClass
		.findById(travelClassId)
		.exec((err, travelClass) => {

			if (err) return next(err);
			if (travelClass) 
				travelClass.name = req.body.name;
			else 
				travelClass = new TravelClass({
					_id: travelClassId,
					name: req.body.name
				});

			travelClass.save((err) => {
				
				if (err) return next(err);
				res.status(200).json({status: 200, message: 'OK', result: '/api/travelclasses/' + travelClassId});
			});
		});
});


//====================================================================
module.exports = travelClassesRouter;