var express = require('express');

//------------------------------------------------------------------------
//Endpoints
var regionsRouter = require('./endpoints/regions')
	locationsRouter = require('./endpoints/locations'),
	passengersRouter = require('./endpoints/passengers'),
	flightsRouter = require('./endpoints/flights'),
	bookingsRouter = require('./endpoints/bookings');

//------------------------------------------------------------------------
var apiRouter = express.Router();

apiRouter.use('/regions', regionsRouter);
apiRouter.use('/locations', locationsRouter);
apiRouter.use('/passengers', passengersRouter);
apiRouter.use('/flights', flightsRouter);
apiRouter.use('/bookingsRouter', bookingsRouter);

//------------------------------------------------------------------------
module.exports = apiRouter;