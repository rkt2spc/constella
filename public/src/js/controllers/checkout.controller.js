appControllers.controller('checkoutCtrl', ['$scope', '$rootScope', '$state', 'bookingService',
	function($scope, $rootScope, $state, bookingService) {

		//--------------------------------------------------------
		//State status
		console.log('State:', 'main.booking.checkout');

		//--------------------------------------------------------
		//Inputs Variables
		
		//--------------------------------------------------------
		//Display Data Variables
		$scope.isPaid = false;
		$scope.message = "Press this magical button to check out";
		$scope.bookingId = null;	

		//--------------------------------------------------------
		//Events triggers
		$scope.checkout = function() {
			$rootScope.loading = true;

			bookingService.makeBooking((err, result) => {

				if (err) {
					console.log(err);
					$scope.message = "You have invalid booking, please fill in all required information";
					$rootScope.loading = false;
				}
				else {
					$scope.isPaid = true;
					$scope.message = 'OK, your booking is valid. I paid it for you';
					$scope.bookingId = result.id;
					$rootScope.loading = false;
					$scope.$apply();
				}

				
			});
		};

		$scope.review = function() {

			if ($scope.isPaid && $scope.bookingId) {
				bookingService.setReviewId($scope.bookingId);
			}

			$state.go('review');
		};

		//--------------------------------------------------------
		//Initialize default data
		

		//--------------------------------------------------------
		//State Change Command	
	}
]);