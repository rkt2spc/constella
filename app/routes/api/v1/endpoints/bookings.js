var ObjectId = require('mongoose').Types.ObjectId,
	Booking = Utils.getModel('Booking').Model,
	Flight = Utils.getModel('Flight').Model,
	Passenger = Utils.getModel('Passenger').Model,
	async = require('async'),
	validator = Utils.getValidator('general'),
	express = require('express'),
	bookingsRouter = express.Router();

var computePriceFactor = function(adults, children, infants) {

	return adults + children*0.75;
}

//====================================================================
bookingsRouter.post('/', function(req, res, next) {

	console.log(req.body);
	//Validate request for syntax error
	if (!req.body.contact || !validator.validateContact(req.body.contact))
		return res.status(400).json({status: 400, message: 'Invalid contact info'});
	if (!req.body.passengers || !validator.validatePassengers(req.body.passengers))
		return res.status(400).json({status: 400, message: 'Invalid passengers info'});
	if (!req.body.forwardRoute || !validator.validateBookingRoute(req.body.forwardRoute))
		return res.status(400).json({status: 400, message: 'Invalid forward booking route'});
	if (req.body.returnRoute) {
		if (!validator.validateBookingRoute(req.body.returnRoute))
			return res.status(400).json({status: 400, message: 'Invalid return booking route'});
	}

	var priceFactor = computePriceFactor(
		req.body.passengers.adults.length, 
		req.body.passengers.children.length,
		req.body.passengers.infants.length
	);

	var forwardPrice = 0, returnPrice = 0;
	async.waterfall([
		//Validate forward route and compute forward price
		function(callback) {
			Flight
				.findById(req.body.forwardRoute._flight)
				.exec((err, flight) => {

					if (err) {
						next(err);
						return callback(true);
					}

					if (!flight) {
						res.status(400).json({status: 400, message: 'Can\'t find forward flight'});
						return callback(true);
					}
					
					var seat = flight.seats.find((s) => s._class === req.body.forwardRoute._class);
					
					if (!seat) {
						res.status(400).json({status: 400, message: 'Can\'t find appropriate seat in forward flight'});
						return callback(true);						
					}
			
					forwardPrice = seat.price * priceFactor;
					callback(null);
				})
		},
		//Validate return route and compute return price
		function(callback) {

			if (!req.body.returnRoute) return callback(null);

			Flight
				.findById(req.body.returnRoute._flight)
				.exec((err, flight) => {
					if (err) {
						next(err);
						return callback(true);
					}

					if (!flight) {
						res.status(400).json({status: 400, message: 'Can\'t find return flight'});
						return callback(true);
					}

					var seat = flight.seats.find((s) => s._class === req.body.returnRoute._class);
					if (!seat) {
						res.status(400).json({status: 400, message: 'Can\'t find appropriate seat in return flight'});
						return callback(true);
					}

					returnPrice = seat.price * priceFactor;
					callback(null);
				})
		},
		//Validate passengers
		function(callback) {

			var adults = req.body.passengers.adults.map((p) => new Passenger(p)),
				children = req.body.passengers.children.map((p) => new Passenger(p)),
				infants = req.body.passengers.infants.map((p) => new Passenger(p));

			var validateTasks = [];
			adults.forEach((p) => validateTasks.push(
				function(cb) {
					p.validate((err) => {
						if (err) return cb(err);
						cb(null);
					});
				}));

			children.forEach((p) => validateTasks.push(
				function(cb) {
					p.validate((err) => {
						if (err) return cb(err);
						cb(null);
					});
				}));

			infants.forEach((p) => validateTasks.push(
				function(cb) {
					p.validate((err) => {
						if (err) return cb(err);
						cb(null);
					});
				}));

			async.waterfall(validateTasks, function(err, result) {
				if (err) {
					next(err);
					return callback(true);
				}
				callback(null, adults, children, infants);
			})
		},
		//Replace booking passengers with their ids
		function(adults, children, infants, callback) {

			for (let i = 0; i < req.body.passengers.adults.length && i < adults.length; ++i) {

				adults[i].save();
				req.body.passengers.adults[i] = adults[i]._id;
			}

			for (let i = 0; i < req.body.passengers.children.length && i < children.length; ++i) {
				
				children[i].save();
				req.body.passengers.children[i] = children[i]._id;
			}

			for (let i = 0; i < req.body.passengers.infants.length && infants.length; ++i) {
				
				infants[i].save();
				req.body.passengers.infants[i] = infants[i]._id;
			}

			callback(null);
		},
		function(callback) {
			req.body.totalPrice = forwardPrice + returnPrice;
			var booking = new Booking(req.body);
			console.log('raw-body:', req.body);
			console.log('booking:', booking);
			console.log('passengers:', booking.passengers);
			booking.save((err) => {
				if (err) {
					next(err);
					return callback(true);
				}

				res.status(200).json({status: 200, message: 'OK', result: { 
						id: booking._id, 
						url: '/api/bookings/' + booking._id
					}
				});
				callback(null);
			})
		}
	]);
	
});

bookingsRouter.get('/:id', function(req, res, next) {

	var id;

	if (!ObjectId.isValid(req.params.id))
		return res.status(400).json({status: 400, message: 'Invalid Id'});

	// var id = new MongoId(req.params.id);
	Booking
		.findById(ObjectId(req.params.id))
		.populate('forwardRoute._flight forwardRoute._class')
		.populate('returnRoute._flight returnRoute._class')
		.populate('passengers.adults passengers.children passengers.infants')
		.exec((err, booking) => {
			// console.log(err);
			if (err) return next(err);
			if (!booking) return res.status(404).json({status: 404, message: 'Can\'t find any booking with provided id'});
			res.status(200).json({status: 200, message: 'OK', result: booking});
		});
})

//====================================================================
module.exports = bookingsRouter;