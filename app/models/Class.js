var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    
    _id:        { type: String, trim: true},
    name:       { type: String, required: true }
});

module.exports = mongoose.model('Class', classSchema);