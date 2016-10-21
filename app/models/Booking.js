var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
    
    bookingInfo: [
        mongoose.Schema({
            _flight:   { type: String, trim: true, required: true, ref: 'Flight' },
            class:     { type: String, required: true}
        }, { _id: false})
    ],

	//Passenger
	passengers: {
        type: [{
            _passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }
        }],
        validate: {
          validator: function(arr) {
            return arr.length >= 1;
          },
          message: 'Invalid seats configuration'
        }
    },

    //The person who own the booking
    customer: { 
    	title: String,
    	firstName: String,
    	lastName: String,
    	email: String,
    	telephone: String,
    	address: String,
    	region: String,
    	note: String
    },

    charge: Number,
    status: Number

}, {timestamps: true});

module.exports = mongoose.model('Booking', bookingSchema);