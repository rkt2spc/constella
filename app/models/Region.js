var mongoose = require('mongoose');

var regionSchema = mongoose.Schema({
    
    _id: 		{ type: String, trim: true},
    name: 		{ type: String, required: true}
});

module.exports = mongoose.model('Region', regionSchema);