var express = require('express');

//------------------------------------------------------------------------
//Endpoints
var locationsRouter = require('./endpoints/locations'),
	passengersRouter = require('./endpoints/passengers'),
	travelClassesRouter = require('./endpoints/travelclasses'),
	flightsRouter = require('./endpoints/flights'),
	bookingsRouter = require('./endpoints/bookings'),
	authenticationRouter = require('./endpoints/authentication');

//------------------------------------------------------------------------
var apiRouter = express.Router();

apiRouter.use('/locations', locationsRouter);
apiRouter.use('/passengers', passengersRouter);
apiRouter.use('/travelclasses', travelClassesRouter);
apiRouter.use('/flights', flightsRouter);
apiRouter.use('/bookings', bookingsRouter);
apiRouter.use('/authentication', authenticationRouter);
//------------------------------------------------------------------------
module.exports = apiRouter;