var valid = require('validator');

exports.validateEmail = {

	validator: function (email) {
		return valid.isEmail(email, {
			allow_utf8_local_part: false,
			require_tld: false
		});
	},
	message: "Invalid Email"
}

exports.validatePhone = {
	validator: function(phone) {
		return valid.isNumeric(phone);
	},
	message: 'Invalid telephone number'
}