appControllers.controller('flightsCtrl', ['$scope', '$state', 'flightsService', 'locationsService', 'travelClassesService', 'bookingService',
	function($scope, $state, flightsService, locationsService, travelClassesService, bookingService) {

		//--------------------------------------------------------
		//State status
		console.log('State:', 'main.booking.flights');

		//--------------------------------------------------------
		//Inputs Variables
		var q = flightsService.getQuery(),
			b = bookingService.getConfig();

		$scope.forwardFlight = b.forwardRoute.flight;
		$scope.returnFlight = b.returnRoute.flight;

		//--------------------------------------------------------
		//Display Data Variables
		var locations; 
		$scope.roundTrip = q.roundTrip;
		$scope.origins = [];
		$scope.destinations = [];
		$scope.travelClasses = [];

		$scope.forwardFlights = [];
		$scope.forwardRouteDescription = '';
		$scope.returnDescription = '';
		$scope.returnFlights = [];

		//--------------------------------------------------------
		//Events triggers
		$scope.setForwardRoute = function(flight, seatSelection) {

			seatSelection = JSON.parse(seatSelection);

			bookingService.setForwardRoute({
				flight: flight,
				class: seatSelection.class
			});

			$scope.returnFlights.map((f) => {
				
				f.valid = f.schedule.departure > flight.schedule.arrival;
				return f;
			});
		};

		$scope.setReturnRoute = function(flight, seatSelection) {

			seatSelection = JSON.parse(seatSelection);

			bookingService.setReturnRoute({
				flight: flight,
				class: seatSelection.class
			});

			$scope.forwardFlights.map((f) => {
				
				f.valid = f.schedule.arrival < flight.schedule.arrival;
				return f;
			});
		};
			
		$scope.calculatePrice = function(seatSelection) {

			seatSelection = JSON.parse(seatSelection);

			var price = seatSelection.price;
			var passengers = bookingService.getConfig().passengers,
				passengersFactor = passengers.adultsCount + passengers.childrenCount*0.75;
			
			return Utils.formatCurrency(price * passengersFactor, 'VND');
		};

		//--------------------------------------------------------
		//Initialize default data
		var transformFlights = function(flights, isForward) {

			if (!flights) return [];

			flights = Utils
				.populate(flights, 'origin')
				.with($scope.origins)
				.where((flight, originLocation) => flight._origin === originLocation._id);

			flights = Utils
				.populate(flights, 'destination')
				.with($scope.destinations)
				.where((flight, destinationLocation) => flight._destination === destinationLocation._id);

			flights = flights.map((flight) => {
				flight.schedule.departure = new Date(flight.schedule.departure);
				flight.schedule.arrival = new Date(flight.schedule.arrival);

				flight.seats = Utils
					.populate(flight.seats, 'class')
					.with($scope.travelClasses)
					.where((seat, travelClass) => seat._class === travelClass._id);

				flight.valid = true;
				if ($scope.returnFlight && isForward)
					flight.valid = $scope.returnFlight.departure? flight.schedule.arrival < $scope.returnFlight.departure : true;
				else if ($scope.forwardFlight && !isForward)
					flight.valid = $scope.forwardFlight.arrival? flight.schedule.departure > $scope.forwardFlight.arrival : true;

				return flight;
			});


			return flights;
		};

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
			},
			function(callback) {

				var origin = (q.origin)? $scope.origins.find((loc) => loc._id === q.origin) : null,
					destination = (q.destination)? $scope.destinations.find((loc) => loc._id === q.destination) : null,
					departing = (q.departing)? q.departing : null,
					returning = (q.returning)? q.returning : null;
				
				$scope.forwardRouteDescription = Utils.formatRouteDescription(origin, destination, departing);
				$scope.returnRouteDescription = Utils.formatRouteDescription(destination, origin, returning);

				callback(null);
			},
			function(callback) {

				flightsService.getForwardFlights((err, flights) => {

					if (err) return callback(err);

					$scope.forwardFlights = transformFlights(flights);			
					callback(null);
				});
			},
			function(callback) {

				if (!$scope.roundTrip) return callback(null);

				flightsService.getReturnFlights((err, flights) => {

					if (err) return callback(err);

					$scope.returnFlights = transformFlights(flights);	
					$scope.$apply();
					callback(null);
				});
			}],

			function(err, result) {

				if (err) console.log(err);	
			}
		);
		

		//--------------------------------------------------------
		//State Change Command
		$scope.continue = function() {

			$state.go('main.booking.passengers');
		};			
	}
]);