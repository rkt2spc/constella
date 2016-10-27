var mongoose = require('mongoose');

//------------------------------------------------------------------------
//Sub document for Booking - go to referenced flight find the seat configuration with referenced class
var passengersInfoSchema = mongoose.Schema({
    
    adults:     { type: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Passenger' }], required: true},
    children:   { type: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Passenger' }]},
    infants:    { type: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Passenger' }]}

}, {

	//Schema Options
	_id: false //No id
});

//------------------------------------------------------------------------
module.exports = {

	Schema: passengersInfoSchema,
	Model: mongoose.model('PassengersInfo', passengersInfoSchema)
}