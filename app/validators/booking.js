exports.validateBookings = {
	validator: function() {

	},
	message: "Invalid bookings"
}

exports.validatePassengers = {

	validator: function(passengersInfo) {
            var adultsCount = passengersInfo.adults.length,
                childrenCount = passengersInfo.children.length,
                infantsCount = passengersInfo.infants.length;

            if (adultsCount <= 0 || adultsCount > 6) 
                return false;
            if (childrenCount < 0 || childrenCount > (6 - adultsCount)) 
                return false;
            if (infantsCount > 6 || infantsCount > adultsCount*2)       
                return false;

            return true;
    },
	message: "Invalid passengers number"
}

exports.validateContact = {

    validator: function(contact) { return true },
    message: "Invalid contact"
}