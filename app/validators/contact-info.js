var valid = require('validator');

exports.validateEmail = {

	validator: function (email) {
		return valid.isEmail(email);
	},
	message: "Invalid Email"
}

exports.validatePhone = {
	validator: function(phone) {
		return valid.isNumeric(phone);
	},
	message: 'Invalid telephone number'
}