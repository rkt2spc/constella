var mongoose = require('mongoose');

//------------------------------------------------------------------------
var travelClassSchema = mongoose.Schema({
    
    _id:        { type: String, required: true, trim: true},
    name:       { type: String, required: true }
});

//------------------------------------------------------------------------
module.exports = {
	
	Schema: travelClassSchema,
	Model: mongoose.model('TravelClass', travelClassSchema)
}