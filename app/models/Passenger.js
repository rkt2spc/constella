var mongoose = require('mongoose');

var passengerSchema = mongoose.Schema({
    
    title: String,
    lastName: String,
    firstName: String

});

module.exports = mongoose.model('Passenger', passengerSchema);