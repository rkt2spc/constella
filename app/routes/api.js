var express = require('express');

//------------------------------------------------------------------------
var v1Api = require('./api/v1/apiRouter');

//------------------------------------------------------------------------
apiRouter = express.Router();
apiRouter.use('/v1', v1Api);

//------------------------------------------------------------------------
//Routing api/ will be using latest version
apiRouter.use('/', v1Api);

//------------------------------------------------------------------------
module.exports = apiRouter;