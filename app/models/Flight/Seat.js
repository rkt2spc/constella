var mongoose = require('mongoose');

//------------------------------------------------------------------------
//Sub document for Flight
var seatSchema = mongoose.Schema({

    _class: 		{ type: String, required: true, trim: true,  ref: 'TravelClass' },
	price: 			{ type: Number, required: true },
	capacity: 		{ type: Number, required: true },
	occupation: 	{ type: Number, required: true, default: 0}

}, {

	//Schema Options
	_id: false //No id
});

//------------------------------------------------------------------------
module.exports = {

	Schema: seatSchema,
	Model: mongoose.model('Seat', seatSchema)
}