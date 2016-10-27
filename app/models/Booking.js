var mongoose = require('mongoose');

//------------------------------------------------------------------------
var bookingInfoSchema       = Utils.getModel('Booking/BookingInfo').Schema,
    passengersInfoSchema    = Utils.getModel('Booking/PassengersInfo').Schema,
    contactInfoSchema       = Utils.getModel('Booking/ContactInfo').Schema;

//------------------------------------------------------------------------
var validator = Utils.getValidator('booking');

//------------------------------------------------------------------------
var bookingSchema = mongoose.Schema({
    
    forwardRoute:   { type: bookingInfoSchema, 	required: true},
    returnRoute:    { type: bookingInfoSchema },
	passengers:     { type: passengersInfoSchema,	required: true, validate: validator.validatePassengers },
    contact:        { type: contactInfoSchema,		required: true,	validate: validator.validateContact },
    totalPrice:     { type: Number,                 default: 0 }

}, {timestamps: true});

//------------------------------------------------------------------------
module.exports = {
    
    Schema: bookingSchema,
    Model: mongoose.model('Booking', bookingSchema)
}