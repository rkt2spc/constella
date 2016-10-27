appControllers.controller('searchCtrl', ['$scope', '$rootScope', '$state', 'locationsService', 'flightsService', 'bookingService',
	function($scope, $rootScope, $state, locationsService, flightsService, bookingService) {
		
		//--------------------------------------------------------
		//State status
		console.log('State:', 'main.search');

		//--------------------------------------------------------
		//Inputs Variables
		var q = flightsService.getQuery(),
			b = bookingService.getConfig();
		$scope.input = {
			roundTrip: q.roundTrip,
			origin: q.origin,
			destination: q.destination,
			departing: q.departing,
			returning: q.returning,
			adults: String(b.passengers.adultsCount),
			children: String(b.passengers.childrenCount),
			infants: String(b.passengers.infantsCount),
			promotion: b.promotion
		};

		//--------------------------------------------------------
		//Display Data Variables	
		$scope.groupedOrigins = {};
		$scope.groupedDestinations = {};
		$scope.adultsOptions = [1, 2, 3, 4, 5, 6];
		$scope.childrenOptions = [0, 1, 2];
		$scope.infantsOptions = [0, 1];
		$scope.minDeparture = new Date();

		//--------------------------------------------------------
		//Events triggers
		$scope.onAdultsChanged = function() {

			var maxChildren = Math.min($scope.input.adults * 2, 6 - $scope.input.adults),
				maxInfants = Number($scope.input.adults) + 1;

			$scope.childrenOptions = 	Array.from(Array(maxChildren + 1).keys());
			$scope.infantsOptions  = 	Array.from(Array(maxInfants).keys());
		};

		$scope.onOriginChanged = function() {
			
			locationsService.getDestinations({from: $scope.input.origin}, (err, destinations) => {
				if (err) return console.log(err);
				$scope.groupedDestinations = Utils.groupedTransform(destinations, 'region');
				$scope.input.destination = null;
				$scope.$apply();
			});
		};

		$scope.onDestinationChanged = function() {

			// locationsService.getOrigins({to: $scope.input.destination}, (err, origins) => {
			// 	if (err) return console.log(err);
			// 	$scope.groupedOrigins = Utils.groupedTransform(origins, 'region');
			// 	$scope.$apply();
			// });
		};

		//--------------------------------------------------------
		//Initialize default data
		async.parallel([
			function(callback) {
				locationsService.getOrigins({}, (err, origins) => {
					if (err) return callback(err);
					$scope.groupedOrigins = Utils.groupedTransform(origins, 'region');
					callback(null);
				});
			},
			function(callback) {
				locationsService.getDestinations({}, (err, destinations) => {
					if (err) return callback(err);
					$scope.groupedDestinations = Utils.groupedTransform(destinations, 'region');
					callback(null);
				});
			}],

			function(err, results) {
				if (err) console.log(err);
			}
		);

	
		//--------------------------------------------------------
		//State Change Command
		$scope.next = function() {
			
			flightsService.setQuery({
				roundTrip: $scope.input.roundTrip,
				departing: $scope.input.departing,
				returning: $scope.input.returning,
				origin: $scope.input.origin,
				destination: $scope.input.destination
			});

			bookingService.setBasicConfig({
				roundTrip: $scope.input.roundTrip,
				promotion: $scope.input.promotion,
				passengers: {
					adultsCount: Number($scope.input.adults),
					childrenCount: Number($scope.input.children),
					infantsCount: Number($scope.input.infants)
				}
			});

			$state.go('main.booking.flights');
		};
	}
]);