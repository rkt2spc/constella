const constant = require('../app/models/Const/siteconst');

//------------------------------------------------------------------------
let configObject = {
	handler: function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(403).json(util.getAPIResponse(constant.API_SUCCESS_NO, err.name + ": " + err.message, null));
        }
        else{
            res.status(500).json(util.getAPIResponse(constant.API_SUCCESS_NO, constant.GENERAL_ERROR + " " + err.message, null));
		}
	}
};

//------------------------------------------------------------------------
module.exports =  configObject;