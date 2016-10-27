var mongoose = require('mongoose');

//------------------------------------------------------------------------
var scheduleSchema  = Utils.getModel('Flight/Schedule').Schema,
    seatSchema      = Utils.getModel('Flight/Seat').Schema;

//------------------------------------------------------------------------
var validator = Utils.getValidator('flight');

//------------------------------------------------------------------------
var flightSchema = mongoose.Schema({
    
    _id:            { type: String,         required: true, trim: true},
    _origin:        { type: String,         required: true, trim: true, ref: 'Location' },
    _destination:   { type: String,         required: true, trim: true, ref: 'Location' },
    schedule:       { type: scheduleSchema, required: true, validate: validator.validateSchedule },
    seats:          { type: [seatSchema],   required: false, validate: validator.validateSeats }
});

//------------------------------------------------------------------------
module.exports = {

    Schema: flightSchema,
    Model: mongoose.model('Flight', flightSchema)
}