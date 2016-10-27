var mongoose = require('mongoose');

//------------------------------------------------------------------------
var validator = Utils.getValidator('contact-info');

//------------------------------------------------------------------------
//Sub document for Booking - go to referenced flight find the seat configuration with referenced class
var contactInfoSchema = mongoose.Schema({
    
    title: 			{ type: String, required: true, 	trim: true },
    firstName: 		{ type: String, required: true, 	trim: true },
    lastName: 		{ type: String, required: true, 	trim: true },
    email: 			{ type: String, required: true, 	trim: true, validate: validator.validateEmail },
    telephone: 		{ type: String, required: true,		trim: true, validate: validator.validatePhone },
    address: 		{ type: String, required: false,	trim: true },
    region: 		{ type: String, required: false,	trim: true },
    note: 			{ type: String, required: false }

}, {

	//Schema Options
	_id: false //No id
});

//------------------------------------------------------------------------
module.exports = {

	Schema: contactInfoSchema,
	Model: mongoose.model('ContactInfo', contactInfoSchema)
}