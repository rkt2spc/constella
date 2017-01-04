/**
 * Created by phong.tran.nam on 04/01/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    hash: {
        type: String,
        require: true
    },
    salt: {
        type: String,
        require: true
    },
    last_login: Date
});

module.exports = {
    Model: mongoose.model('User', UserSchema)
};
