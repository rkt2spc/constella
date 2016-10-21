var mongoose = require('mongoose');

var flightSchema = mongoose.Schema({
    
    _id:            { type: String, trim: true},
    _origin:        { type: String, trim: true, required: true, ref: 'Location' },
    _destination:   { type: String, trim: true, required: true, ref: 'Location' },
    departure:      { type: Date,   required: true},
    arrival:        { type: Date,   required: true},
    seats: {
        type: [
            mongoose.Schema({

    	       _class: { type: String, trim: true, required: true, ref: 'Class' },
	           price: { type: Number, required: true },
	           capacity: { type: Number, required: true}
            }, {_id: false})
        ],
        validate: {
          validator: function(arr) {
            return arr.length >= 1;
          },
          message: 'Invalid seats configuration'
        },

    }
});

module.exports = mongoose.model('Flight', flightSchema);