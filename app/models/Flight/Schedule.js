var mongoose = require('mongoose');

//------------------------------------------------------------------------
//Sub document for Flight
var scheduleSchema = mongoose.Schema({
    
    departure: 	{ type: Date, required: true },
    arrival: 	{ type: Date, required: true }

}, {

	//Schema Options
	_id: false //No id
});

//------------------------------------------------------------------------
module.exports = {

	Schema: scheduleSchema,
	Model: mongoose.model('Schedule', scheduleSchema)
}