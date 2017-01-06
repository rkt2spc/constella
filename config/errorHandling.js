//------------------------------------------------------------------------
var configObject = {
	
	handler: function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401);
            res.json({"message" : err.name + ": " + err.message});
        }
        else{
            // console.log(err);
            res.status(500).json({
                msg: "Unhandled error",
                error: err
            });
		}
	}
}

//------------------------------------------------------------------------
module.exports =  configObject;