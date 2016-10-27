appControllers.controller('reviewCtrl', ['$scope', '$rootScope', '$state', 'bookingService', 'locationsService', 'travelClassesService',
	function($scope, $rootScope, $state, bookingService, locationsService, travelClassesService) {

		//--------------------------------------------------------
		//State status
		console.log('State:', 'review');

		//--------------------------------------------------------
		//Inputs Variables
		$scope.hasBooking = false;
		$scope.bookingId = bookingService.getReviewId();
		if ($scope.bookingId) $scope.bookingId = JSON.parse(JSON.stringify($scope.bookingId));

		$scope.booking = {
			passengers: {
				adults: [],
				children: [],
				infants: []
			},
			contact: {
				title: null,
				firstName: null,
				lastName: null,
				email: null,
				telephone: null,
				address: null,
				region: null,
				note: null
			},
			forwardRoute: {
				flight: null,
				class: null
			},
			returnRoute: {
				flight: null,
				class: null
			},
			totalPrice: 0
		};
		$scope.message = '';

		//--------------------------------------------------------
		//Display Data Variables
		$scope.origins = [];
		$scope.destinations = [];
		$scope.travelClasses = [];
		$scope.forwardRoute = $scope.booking.forwardRoute;
		$scope.returnRoute = $scope.booking.returnRoute;
		$scope.passengers = $scope.booking.passengers;
		$scope.contact = $scope.booking.contact;

		//--------------------------------------------------------
		//Events triggers
		$scope.searchBooking = function() {

			if (!$scope.bookingId) {
				$scope.message = 'Please provide an booking id';
				return;
			}

			$rootScope.loading = true;
			bookingService.getBooking($scope.bookingId, (err, result) => {

				if (err) {
					$scope.message = 'Can\'t find any booking with provided id';	
					$scope.hasBooking = false;
					$rootScope.loading = false;	
					$scope.$apply();
					return;
				}

				$scope.booking = transformBooking(result);
				$scope.forwardRoute = $scope.booking.forwardRoute;
				$scope.returnRoute = $scope.booking.returnRoute;
				$scope.passengers = $scope.booking.passengers;
				$scope.contact = $scope.booking.contact;

				$scope.message = '';
				$scope.hasBooking = true;
				$rootScope.loading = false;
				$scope.$apply();
			});
		};

		$scope.formatCurrency = function(price) {
			if (!price) return 0;
			return Utils.formatCurrency(price, 'VND');
		};

		var transformFlight = function(f) {

			if (!f) return;

			f.schedule.departure = new Date(f.schedule.departure);
			f.schedule.arrival = new Date(f.schedule.arrival);
			f.origin = $scope.origins.find((o) => o._id === f._origin);
			delete f._origin;
			f.destination = $scope.destinations.find((d) => d._id === f._destination);
			delete f._destination;

			return f;
		};

		var transformBooking = function(b) {

			if (!b) return;

			b.createdAt = new Date(b.createdAt);
			b.updatedAt = new Date(b.updatedAt);

			b.forwardRoute.class = b.forwardRoute._class;
			delete b.forwardRoute._class;
			b.forwardRoute.flight = b.forwardRoute._flight;
			delete b.forwardRoute._flight;
			transformFlight(b.forwardRoute.flight);

			if (b.returnRoute) {
				b.returnRoute.class = b.returnRoute._class;
				delete b.returnRoute._class;
				b.returnRoute.flight = b.returnRoute._flight;
				delete b.returnRoute._flight;

				transformFlight(b.returnRoute.flight);
			}

			return b;
		};

		//--------------------------------------------------------
		//Initialize default data
		async.waterfall([
			function(callback) {

				locationsService.getOrigins({}, (err, origins) => {
					
					if (err) return callback(err);
					
					$scope.origins = origins;
					callback(null);
				});
			},
			function(callback) {

				locationsService.getDestinations({}, (err, destinations) => {

					if (err) return callback(err);

					$scope.destinations = destinations;
					callback(null);
				});
			},
			function(callback) {

				travelClassesService.getTravelClasses((err, travelClasses) => {

					if (err) return callback(err);

					$scope.travelClasses = travelClasses;
					callback(null);
				});
			}],
			function(err, result) {

				if (err) console.log(err);
			}
		);
		//--------------------------------------------------------
		//State Change Command	
	}
]);