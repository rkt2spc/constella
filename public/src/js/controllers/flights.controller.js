appControllers.controller('bookingCtrl', ['$scope', '$state',
	function($scope, $state){

		$scope.next = function() {
			$state.go('booking.passengers');
		}			
	}
]);