appControllers.controller('passengersCtrl', ['$scope', '$state', 'bookingService',
	function($scope, $state, bookingService){

		//--------------------------------------------------------
		//State status
		console.log('State:', "main.booking.passengers");

		//--------------------------------------------------------
		//Inputs Variables
		var b = bookingService.getConfig();
		
		//--------------------------------------------------------
		//Display Data Variables
		$scope.adults = [];
		$scope.children = [];
		$scope.infants = [];
		$scope.contact = {};

		//--------------------------------------------------------
		//Events triggers
		$scope.updatePassengers = function() {

			bookingService.updatePassengers({
				adults: $scope.adults,
				children: $scope.children,
				infants: $scope.infants
			});
		};
		$scope.updateContact = function() {
			bookingService.updateContact($scope.contact);
		};


		//--------------------------------------------------------
		//Initialize default data
		b.passengers.adults.forEach((p) => {
			$scope.adults.push({
				title: p.title,
				firstName: p.firstName,
				lastName: p.lastName,
				dateOfBirth: p.dateOfBirth? new Date(p.dateOfBirth.getTime()) : null
			});
		});
		b.passengers.children.forEach((p) => {
			$scope.children.push({
				title: p.title,
				firstName: p.firstName,
				lastName: p.lastName,
				dateOfBirth: p.dateOfBirth? new Date(p.dateOfBirth.getTime()) : null
			});
		});
		b.passengers.infants.forEach((p) => {
			$scope.infants.push({
				title: p.title,
				firstName: p.firstName,
				lastName: p.lastName,
				dateOfBirth: p.dateOfBirth? new Date(p.dateOfBirth.getTime()) : null
			});
		});
		$scope.contact = {
			title: b.contact.title,
			firstName: b.contact.firstName,
			lastName: b.contact.lastName,
			email: b.contact.email,
			telephone: b.contact.telephone,
			address: b.contact.address,
			region: b.contact.region,
			note: b.contact.note
		};

		//--------------------------------------------------------
		//State Change Command	
		$scope.next = function() {
			$state.go('main.booking.checkout');
		};			
	}
]);