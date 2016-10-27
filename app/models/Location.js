var mongoose = require('mongoose');

//------------------------------------------------------------------------
var locationSchema = mongoose.Schema({
    
    _id: 		{ type: String, required: true, trim: true },
    region: 	{ type: String, required: true, trim: true },
    name: 		{ type: String, required: true }
});

//------------------------------------------------------------------------
module.exports = {

	Schema: locationSchema,
	Model: mongoose.model('Location', locationSchema)
}