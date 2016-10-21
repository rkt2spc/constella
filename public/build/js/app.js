var app = angular.module("app", ['ui.router', 'appComponents', 'appControllers']);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    // An array of state definitions
    var states = [
      {
        name: 'home',
        url: '/',
        component: 'home'
      },

      {
        name: 'booking',
        url: '/booking',
        component: 'booking'
      },

      {
        name: 'booking.search',
        url: '/search',
        component: 'search'
      },

      {
        name: 'booking.flights',
        url: '/flights',
        component: 'flights'
      },

      {
        name: 'booking.passengers',
        url: '/passengers',
        component: 'passengers'
      }

    ];

    states.forEach((state) => {
      $stateProvider.state(state);
    });
  }
]);


var appComponents = angular.module("appComponents",['appControllers']);
var appControllers = angular.module("appControllers",[]);
appComponents.component('booking', {
	templateUrl: '../partials/booking.html',
	controller: 'bookingCtrl'
});
appComponents.component('flights', {
	templateUrl: '../partials/booking/flights.html',
	controller: 'flightsCtrl'
});
appComponents.component('home', {
	templateUrl: '../partials/home.html'
});
appComponents.component('passengers', {
	templateUrl: '../partials/passengers.html'
});
appComponents.component('search', {
	templateUrl: '../partials/booking/search.html',
	controller: 'searchCtrl'
});
appControllers.controller('bookingCtrl', ['$scope', '$state',
	function($scope, $state){

		$state.go('booking.search');

				
	}
]);
appControllers.controller('bookingCtrl', ['$scope', '$state',
	function($scope, $state){

		$scope.next = function() {
			$state.go('booking.passengers');
		}			
	}
]);
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