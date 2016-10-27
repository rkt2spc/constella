var Flight = Utils.getModel('Flight').Model,
    TravelClass = Utils.getModel('TravelClass').Model;

module.exports = {
    logged: false,
    setLog: function(value) { this.logged = value; },
    //------------------------
    validateContact: function(contact) {

        if (!contact.title) return false;
        if (!contact.firstName) return false;
        if (!contact.lastName) return false;
        if (!contact.email) return false;
        if (!contact.telephone) return false;

        return true;
    },
    //------------------------
    validateBookingRoute: function(bookingRoute) {

        console.log('validating booking route:');
        console.log(bookingRoute);

        if (!bookingRoute._flight) return false;
        if (!bookingRoute._class) return false;
        
        return true;
    },
    //------------------------
    validatePassenger: function(passenger) {

        if (!passenger.title) return false;
        if (!passenger.firstName) return false;
        if (!passenger.lastName) return false;
        if (!passenger.dateOfBirth) return false;

        return true;
    },
    //------------------------
    validatePassengers: function(passengers) {
        
        if (!passengers.adults || !passengers.children || !passengers.infants) return false;

        var adultsCount = passengers.adults.length, childrenCount = passengers.children.length, infantsCount = passengers.infants.length;
        if (adultsCount <= 0 || adultsCount > 6) return false;
        if (childrenCount < 0 || childrenCount > (2 * adultsCount) || childrenCount > (6 - adultsCount)) return false;
        if (infantsCount < 0 || infantsCount > adultsCount) return false;

        var failFlag = false;
        for(let i = 0; i < adultsCount; ++i) {
            if (!this.validatePassenger(passengers.adults[i])) {
                failFlag = true;
                break;
            }
        }
        if (failFlag) return false;

        
        for(let i = 0; i < childrenCount; ++i) {
            if (!this.validatePassenger(passengers.children[i])) {
                failFlag = true;
                break;
            }
        }
        if (failFlag) return false;

        for(let i = 0; i < infantsCount; ++i) {
            if (!this.validatePassenger(passengers.infants[i])) {
                failFlag = true;
                break;
            }
        }
        if (failFlag) return false;


        return true;
    }
}

