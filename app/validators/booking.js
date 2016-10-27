exports.validateBookings = {
	validator: function() {

	},
	message: "Invalid bookings"
}

exports.validatePassengers = {

	validator: function(passengersInfo) {
            var adultsCount = passengersInfo.adultsCount,
                childrenCount = passengersInfo.childrenCount,
                infantsCount = passengersInfo.infantsCount;

            if (adultsCount <= 0 || adultsCount > 6) 
                return false;
            if (childrenCount < 0 || childrenCount > (2 * adultsCount) || childrenCount > (6 - adultsCount)) 
                return false;
            if (infantsCount < 0 || infantsCount > adultsCount)       
                return false;

            return true;
    },
	message: "Invalid passengers number"
}

exports.validateContact = {

    validator: function(contact) { return true },
    message: "Invalid contact"
}