var mongoose = require('mongoose');

//------------------------------------------------------------------------
//Sub document for Booking - go to referenced flight find the seat configuration with referenced class
var bookingInfoSchema = mongoose.Schema({
    
    _flight: 	{ type: String, required: true, trim: true, ref: 'Flight' },
    _class: 	{ type: String, required: true, trim: true, ref: 'TravelClass' }

}, {
	
	//Schema Options
	_id: false
});

//------------------------------------------------------------------------
module.exports = {

	Schema: bookingInfoSchema,
	Model: mongoose.model('BookingInfo', bookingInfoSchema)
}