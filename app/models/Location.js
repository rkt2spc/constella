var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    
    _id: 		{ type: String, trim: true},
    name: 		{ type: String, required: true },
    _region: 	{ type: String, trim: true, required: true, ref: 'Region'}
});

module.exports = mongoose.model('Location', locationSchema);