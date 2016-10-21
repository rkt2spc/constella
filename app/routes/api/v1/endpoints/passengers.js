var Passenger = Utils.getModel('Passenger'),
	express = require('express'),
	passengersRouter = express.Router();

//====================================================================
passengersRouter.get('/:id', function(req, res, next) {

	var passengerId = req.params.id.trim();

	Passenger
		.findById(passengerId)
		.exec((err, passenger) => {

			if (err) return next(err);
			if (!passenger) return res.status(404).json({status: 404, message: 'Can\'t find any passenger with provided id'});
			res.status(200).json({status: 200, message: 'OK', result: passenger});
		});
});

//====================================================================
passengersRouter.post('/', function(req, res, next) {

	//Validate body

	var passenger = new Passenger({
		title: req.body.title,
		firstname: req.body.firstname,
		lastname: req.body.lastname
	});

	passenger.save((err) => {

		if (err) return next(err);
		res.status(200).json({status: 200, message: "Saved", result: "/api/passenger/" + passenger._id});
	});
});

//====================================================================
module.exports = passengersRouter;