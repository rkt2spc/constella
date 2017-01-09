var express = require('express');

//------------------------------------------------------------------------
//Endpoints
const jwt = require('express-jwt'),
    locationsRouter = require('./endpoints/locations'),
    passengersRouter = require('./endpoints/passengers'),
    travelClassesRouter = require('./endpoints/travelclasses'),
    flightsRouter = require('./endpoints/flights'),
    bookingsRouter = require('./endpoints/bookings'),
    authenticationRouter = require('./endpoints/authentication');

//------------------------------------------------------------------------
//Protect API
//usage: apiRouter.use('/locations', auth, locationsRouter);
let auth = jwt({
    secret: App.secret,
    userProperty: 'payload'
});

//------------------------------------------------------------------------
let apiRouter = express.Router();

// Authorize api
apiRouter.use('/locations', auth, locationsRouter);
apiRouter.use('/passengers', auth, passengersRouter);
apiRouter.use('/travelclasses', auth, travelClassesRouter);
apiRouter.use('/flights', auth, flightsRouter);
apiRouter.use('/bookings', auth, bookingsRouter);
// Anonymous api
apiRouter.use('/authentication', authenticationRouter);
//------------------------------------------------------------------------
module.exports = apiRouter;