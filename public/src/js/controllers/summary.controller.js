appControllers.controller('summaryCtrl', ['$scope', '$state', 'bookingService', 'locationsService', 'travelClassesService',
	function($scope, $state, bookingService, locationsService, travelClassesService) {

		//--------------------------------------------------------
		//State status

		//--------------------------------------------------------
		//Inputs Variables
		var b = bookingService.getConfig();

		//--------------------------------------------------------
		//Display Data Variables
		$scope.roundTrip = b.roundTrip;
		$scope.origins = [];
		$scope.destinations = [];
		$scope.travelClasses = [];

		$scope.config = b;
		$scope.forwardRoute = b.forwardRoute;
		$scope.returnRoute = b.returnRoute;
		$scope.passengers = b.passengers;
		$scope.contact = b.contact;


		//--------------------------------------------------------
		//Events triggers
		$scope.formatCurrency = function(price) {
			return Utils.formatCurrency(price, 'VND');
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