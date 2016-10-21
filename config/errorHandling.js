//------------------------------------------------------------------------
var configObject = {
	
	handler: function (err, req, res, next) {

		// console.log(err);
		res.status(500).json({
	        msg: "Unhandled error",
	        error: err
	    });
	}
}

//------------------------------------------------------------------------
module.exports =  configObject;