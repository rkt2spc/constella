appControllers.controller('searchCtrl', ['$scope', '$state', 
	function($scope, $state){

		$scope.tripType = 'oneway-trip'; //'oneway-trip', 'round-trip', 'multiple-destinations'


		$scope.next = function() {
			console.log('gege');
			$state.go('booking.flights');
		}

		// $.ajax('http://127.0.0.1:3000/api/location',{
		// 	method: 'GET',
		// 	success: function(data, textStatus, jqXHR){
				
		// 		var region = [];
		// 		region = data.map((location) => location.region);
		// 		region = Array.from(new Set(region));

		// 		$scope.groupedLocation = {};

		// 		region.forEach(function(regionName) {

		// 			$scope.groupedLocation[regionName] = 
		// 				data.filter((location) => location.region === regionName);
		// 					// .map((location) => location.name);
		// 		});

		// 		console.log(Object.keys($scope.groupedLocation))
		// 		$scope.$apply();
		// 	}
		// })
	}
]);