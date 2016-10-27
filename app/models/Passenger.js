var mongoose = require('mongoose');

//------------------------------------------------------------------------
var passengerSchema = mongoose.Schema({
    
    title: 			{ type: String, required: true },
    firstName: 		{ type: String, required: true },
    lastName: 		{ type: String, required: true },
    dateOfBirth: 	{ type: Date, 	required: true }
});

//------------------------------------------------------------------------
module.exports = {

	Schema: passengerSchema,
	Model: mongoose.model('Passenger', passengerSchema)
}