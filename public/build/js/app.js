var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngSanitize', 'appComponents', 'appControllers', 'appServices']);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/main', '/main/search');
    $urlRouterProvider.when('/main/booking', '/main/booking/flights');

    // An array of state definitions
    var states = [
      {
        name: 'home',
        url: '/',
        component: 'home',
        resolve: {
          'longLoading': (testService) => testService.loadingPromise(300), //Test loading
        }
      },

      {
        name: 'review',
        url: '/review',
        component: 'review'
      },
      
      {
        name: 'main',
        component: 'main',
        url: '/main',
        resolve: {
          'originsData': (locationsService) => locationsService.getOriginsPromise(),
          'destinationsData': (locationsService) => locationsService.getDestinationsPromise()
        }
      },

      {
        name: 'main.search',
        url: '/search',
        component: 'search',
        resolve: {
          'longLoading': (testService) => testService.loadingPromise(300), //Test loading       
        }
      },

      {
        name: 'main.booking',
        component: 'booking',
        url: '/booking',
        resolve: {
          'forwardRouteData': (flightsService) => flightsService.getForwardRoutePromise(),
          'returnRouteData': (flightsService) => flightsService.getReturnRoutePromise(),
          'travelClassesData': (travelClassesService) => travelClassesService.getTravelClassesPromise()
        }
      },

      {
        name: 'main.booking.flights',
        url: '/flights',
        component: 'flights',
        resolve: {
          'longLoading': (testService) => testService.loadingPromise(300), //Test loading
        }
      },

      {
        name: 'main.booking.passengers',
        url: '/passengers',
        component: 'passengers',
        resolve: {
          'longLoading': (testService) => testService.loadingPromise(300), //Test loading
        }
      },

      {
        name: 'main.booking.checkout',
        url: '/checkout',
        component: 'checkout',
        resolve: {
          'longLoading': (testService) => testService.loadingPromise(300), //Test loading
        }
      }

    ];

    states.forEach((state) => {
      $stateProvider.state(state);
    });
  }
]);

app.run(['$rootScope', '$transitions',
  function($rootScope, $transitions){

    $transitions.onStart({}, () => {
      console.log('loading data...');
      $rootScope.loading = true;
    });
    $transitions.onSuccess({}, () => {
      console.log('loading success');
      $rootScope.loading = false;
      $("html, body").animate({ scrollTop: 0 }, 200);
    });   
}]);


var appComponents = angular.module("appComponents",['appControllers']);
var appControllers = angular.module("appControllers",[]);
function getRandomInt(min, max) {
  	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min;
}
function selectRandom(arr) {

	var index = getRandomInt(0, arr.length);
	return arr[index];
}
function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
function countDigits(num) {
	var d = 0, temp = num;
	while (temp / 10) {
		d++;
		temp = temp / 10;
	}

	return d;
}

function generateTask(index, origin, destination, departure, arrival) {
	
	let flight = {
		_id: formatNumberLength(index, 8),
		origin: origin,
		destination: destination,
		departure: departure,
		arrival: arrival,
		seats: [{
			_class: "C",
			price: 2000000,
			capacity: 50
		}, {
			_class: "D",
			price: 1700000,
			capacity: 50
		}, {
		  	_class: "M",
		  	price: 1000000,
		  	capacity: 200
		}, {
			_class: "N",
			price: 700000,
			capacity: 200
		}, {
			_class: "P",
			price: 300000,
			capacity: 50
		}, {
			_class: "U",
			price: 500000,
			capacity: 50
		}]
	};

	return function() {

		$.ajax({
			url: '/api/flights/BOT' + flight._id,
			method: 'PUT',
			data: flight,
			succes: (response) => console.log('generated:', response.result),
			error: (xhr, textStatus, errorThrown) => console.log(xhr.responseJSON)
		});	
	};
}


var generateData = function(nDate) {
	if (!async) return console.log('please install async');
	if (!$) return console.log('please install jquery');

	async.waterfall([
		function(callback) {

			var promise = new Promise((fulfill, reject) => {
				$.ajax({
					url: '/api/locations',
					method: 'GET',
					success: fulfill,
					error: reject
				});
			});

			promise
				.then((response) => callback(null, response.result))
				.catch((xhr, textStatus, errorThrown) => callback(xhr.responseJSON));
			
		},
		function(locations, callback) {
			var timeSeed = new Date(),
				interval = 12, //hours
				nLoop = 24 * nDate / interval;

			var index = 1, nDigit = 8;
			timeSeed.setHours(0, 0, 0, 0);

			console.log('nLoop', nLoop);
			console.log('locations', locations.length);
			var tasks = [];
			for (let i = 0; i < nLoop; ++i) {

				let departure = timeSeed.getTime(),
					arrival = departure + (selectRandom([2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]) * 3600 * 1000);

				for (let j = 0; j < locations.length; ++j) {
					for (let k = 0; k < locations.length; ++k) {
						if (j === k) continue;

						tasks.push(generateTask(index++, locations[j]._id, locations[k]._id, departure, arrival));
					}
				}

				timeSeed.setTime(departure + interval * 3600 * 1000);
			}

			callback(null, tasks);
		},
		function(tasks, callback) {
			
			tasks.forEach((task) => {
				task();
			});
		}]
	);
};
var appServices = angular.module("appServices", []);
var Utils = {
	groupedTransform: function(data, propKey) {

		var groupKeys = [];
		groupKeys = data.map((item) => item[propKey]);
		groupKeys = Array.from(new Set(groupKeys));

		var groupedData = {};
		groupKeys.forEach((key) => {

			groupedData[key] = data.filter((item) => item[propKey] === key);
		});

		return groupedData;
	},

	populate: function(data1, propKey) {
		
		return {
			with: function(data2) {
				return {
					where: function(comparer) {
						
						return data1.map((item1) => {
							item1[propKey] = data2.find((item2) => comparer(item1, item2));
							return item1;
						});
					}
				};
			}
		};
	},

	formatCurrency: function(input, unit) {
		input = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' ' + unit;
		return input;
	},

	formatRouteDescription: function(origin, destination, departure) {

		var routeDescription = 'All flights';

		routeDescription += (origin)? ' from <b>' + origin.name + '</b>' : '';
		routeDescription += (destination)? ' to <b>' + destination.name + '</b>' : '';
		routeDescription += (departure)? ' leaving on <b>' + departure.toLocaleDateString() + '</b>' : '';

		return routeDescription;
	}
};
appComponents.component('booking', {
	templateUrl: '../partials/main/booking.html',
	controller: 'bookingCtrl'
});
appComponents.component('checkout', {
	templateUrl: '../partials/main/booking/checkout.html',
	controller: 'checkoutCtrl'
});
appComponents.component('flights', {
	templateUrl: '../partials/main/booking/flights.html',
	controller: 'flightsCtrl'
});
appComponents.component('home', {
	templateUrl: '../partials/home.html'
});
appComponents.component('main', {
	templateUrl: '../partials/main.html',
	controller: 'mainCtrl'
});
appComponents.component('passengers', {
	templateUrl: '../partials/main/booking/passengers.html',
	controller: 'passengersCtrl'
});
appComponents.component('review', {
	templateUrl: '../partials/review.html',
	controller: 'reviewCtrl'
});
appComponents.component('search', {
	templateUrl: '../partials/main/search.html',
	controller: 'searchCtrl'
});
appComponents.component('summary', {
	templateUrl: '../partials/main/booking/summary.html',
	controller: 'summaryCtrl'
});
appControllers.controller('bookingCtrl', ['$scope', '$state', 'testService',
	function($scope, $state, testService) {

		//--------------------------------------------------------
		//State status
		console.log('State:', 'main.booking');

		//--------------------------------------------------------
		//Inputs Variables
		
		//--------------------------------------------------------
		//Display Data Variables

		//--------------------------------------------------------
		//Events triggers


		//--------------------------------------------------------
		//Initialize default data

		//--------------------------------------------------------
		//State Change Command	
	}
]);
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
appControllers.controller('mainCtrl', ['$scope', '$state',
	function($scope, $state) {

		//--------------------------------------------------------
		//State status
		console.log('State:', 'main');		
	}
]);
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
appServices.factory('bookingService', ['validateService',
	function(validateService) {

		var reviewingBookingId = null;
		var config = {
			roundTrip: true,
			promotion: null,
			passengers: {
				adultsCount: 1,
				childrenCount: 0,
				infantsCount: 0,
				adults: [{
								title: null,
								firstName: null,
								lastName: null,
								dateOfBirth: null
							}],
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

		//--------------------------------------------------------------------
		var reallocatePassengers = function(passengers, realLength) {

			if (passengers.length < realLength) {

				var itemCount = realLength - passengers.length;
				for(let i = 0; i < itemCount; ++i) {
					passengers.push({
						title: null,
						firstName: null,
						lastName: null,
						dateOfBirth: null
					});
				}
	
			} else if (passengers.length > realLength)
				passengers.slice(0, realLength);
		};

		var evaluatePrice = function(route) {
			if (!route || !route.flight || !route.class) return 0;

			var seatConfig = route.flight.seats.find((s) => s._class === route.class._id),
				price = seatConfig.price;

			var passengers = config.passengers,
				passengersFactor = passengers.adultsCount + passengers.childrenCount*0.75;
		
			return price * passengersFactor;
		};

		//--------------------------------------------------------------------
		var service = {
			getConfig: function() {
				return config;
			},
			//======================================================
			revaluatePrice: function() {
				var forwardPrice = evaluatePrice(config.forwardRoute),
					returnPrice = evaluatePrice(config.returnRoute);

				config.totalPrice = forwardPrice + returnPrice;
			},
			//======================================================
			setBasicConfig: function(cfg) {
				config.roundTrip = cfg.roundTrip;
				config.promotion = cfg.promotion;

				if (cfg.passengers) {
					config.passengers.adultsCount = cfg.passengers.adultsCount || 1;
					config.passengers.childrenCount = cfg.passengers.childrenCount || 0;
					config.passengers.infantsCount = cfg.passengers.infantsCount || 0;

					reallocatePassengers(config.passengers.adults, config.passengers.adultsCount);
					reallocatePassengers(config.passengers.children, config.passengers.childrenCount);
					reallocatePassengers(config.passengers.infants, config.passengers.infantsCount);
				}
			},
			//======================================================
			setForwardRoute: function(route) {
				if (route) {

					config.forwardRoute.flight = route.flight || null;
					config.forwardRoute.class = route.class || null;

					this.revaluatePrice();
				}
			},
			setReturnRoute: function(route) {
				if (route) {

					config.returnRoute.flight = route.flight || null;
					config.returnRoute.class = route.class || null;

					this.revaluatePrice();
				}
			},
			//======================================================
			updatePassengers: function(newPassengers) {
				for (let i = 0; i < newPassengers.adults.length; ++i) {
					config.passengers.adults[i] = {
						title: newPassengers.adults[i].title,
						firstName: newPassengers.adults[i].firstName,
						lastName: newPassengers.adults[i].lastName,
						dateOfBirth: new Date(newPassengers.adults[i].dateOfBirth.getTime())
					};
				}
				for (let i = 0; i < newPassengers.children.length; ++i) {
					config.passengers.children[i] = {
						title: newPassengers.children[i].title,
						firstName: newPassengers.children[i].firstName,
						lastName: newPassengers.children[i].lastName,
						dateOfBirth: new Date(newPassengers.children[i].dateOfBirth.getTime())
					};
				}
				for (let i = 0; i < newPassengers.infants.length; ++i) {
					config.passengers.infants[i] = {
						title: newPassengers.infants[i].title,
						firstName: newPassengers.infants[i].firstName,
						lastName: newPassengers.infants[i].lastName,
						dateOfBirth: new Date(newPassengers.infants [i].dateOfBirth.getTime())
					};
				}
			},
			updateContact: function(newContact) {
				config.contact.title = newContact.title || null;
				config.contact.firstName = newContact.firstName || null;
				config.contact.lastName = newContact.lastName || null;
				config.contact.email = newContact.email || null;
				config.contact.telephone = newContact.telephone || null;
				config.contact.address = newContact.address || null;
				config.contact.region = newContact.region || null;
				config.contact.note = newContact.note || null;
			},
			//======================================================
			getReviewId: function() { return reviewingBookingId; },
			setReviewId: function(rv) { reviewingBookingId = rv; },
			getBooking: function(id, callback) {

				reviewingBookingId = id;

				var promise = new Promise((fulfill, reject) => {
					$.ajax({
						url: '/api/bookings/' + reviewingBookingId,
						method: 'GET',
						success: fulfill,
						error: reject
					});
				});

				promise
					.then((response) => callback(null, response.result))
					.catch((xhr, textStatus, errorThrown) => callback(xhr));
			},
			//======================================================
			makeBooking: function(callback) {

				var requestBody = {};

				if (!validateService.validateContact(config.contact)) return callback('Invalid contact info');
				else requestBody.contact = config.contact;

				if (!validateService.validatePassengers(config.passengers)) return callback('Invalid passengers info');
				else requestBody.passengers = {
					adults: config.passengers.adults,
					children: config.passengers.children,
					infants: config.passengers.infants
				};

				if (!validateService.validateBookingRoute(config.forwardRoute)) return callback('Invalid forward route');
				else requestBody.forwardRoute = {
					_flight: config.forwardRoute.flight._id,
					_class: config.forwardRoute.class._id
				};

				if (config.roundTrip) {
					if (validateService.validateBookingRoute(config.returnRoute))
						requestBody.returnRoute = {
							_flight: config.returnRoute.flight._id,
							_class: config.returnRoute.class._id
						};
				}
				console.log(requestBody);
				var promise = new Promise((fulfill, reject) => {
					$.ajax({
						url: '/api/bookings',
						method: 'POST',
						contentType: 'application/json',
						data: JSON.stringify(requestBody),
						success: fulfill,
						error: reject
					});
				});

				promise
					.then((response) => callback(null, response.result))
					.catch((xhr, textStatus, errorThrown) => callback(xhr));
			}
		};

		return service;
	}
]);
appServices.factory('flightsService', [
	function() {

		var query = {
			roundTrip: true,
			origin: null,
			destination: null,
			departing: null,
			returning: null
		};

		var forwardFlights = null,
			returnFlights = null;

		//--------------------------------------------------------------------
		var getForwardRouteQuery = function() {

			var forwardQuery = {};
			if (query.origin) forwardQuery.origin = query.origin;
			if (query.destination) forwardQuery.destination = query.destination;
			if (query.departing) forwardQuery.departure = query.departing.getTime();

			return forwardQuery;
		};

		var forwardRoutePromiseParams = function(fullfill, reject) {
			$.ajax({
				url: '/api/flights',
				method: 'GET',
				data: getForwardRouteQuery(),
				success: fullfill,
				error: reject
			});
		};

		var forwardRoutePromise = null;

		//--------------------------------------------------------------------
		var getReturnRouteQuery = function() {

			var returnQuery = {};
			if (query.origin) returnQuery.destination = query.origin;
			if (query.destination) returnQuery.origin = query.destination;
			if (query.returning) returnQuery.departure = query.returning.getTime();

			return returnQuery;
		};

		var returnRoutePromiseParams = function(fullfill, reject) {
			$.ajax({
				url: '/api/flights',
				method: 'GET',
				data: getReturnRouteQuery(),
				success: fullfill,
				error: reject
			});
		};

		var returnRoutePromise = null;

		//--------------------------------------------------------------------
		
		var service = {

			getQuery: function() { return query; },
			setQuery: function(q) {

				query.roundTrip 	= q.roundTrip;
				query.origin 		= q.origin 		|| null;
				query.destination 	= q.destination	|| null;
				query.departing 	= q.departing 	|| null;
				query.returning 	= q.returning 	|| null;
				//--------------
				forwardFlights = forwardRoutePromise = null;
				returnFlights = returnRoutePromise = null;
			},

			getForwardRoutePromise: function() {

				if (!forwardRoutePromise || !forwardFlights) {

					forwardRoutePromise = new Promise(forwardRoutePromiseParams);

					forwardRoutePromise
						.then((response) => forwardFlights = response.result)
						.catch((xhr, textStatus, errorThrown) => forwardFlights = null);
				}

				return forwardRoutePromise;
			},
			getReturnRoutePromise: function() {

				if (!query.roundTrip)
					return Promise.resolve({result: null});

				if (!returnRoutePromise || !returnFlights) {

					returnRoutePromise = new Promise(returnRoutePromiseParams);

					returnRoutePromise
						.then((response) => returnFlights = response.result)
						.catch((xhr, textStatus, errorThrown) => returnFlights = null);
				}

				return returnRoutePromise;
			},
			getForwardFlights: function(callback) {

				if (forwardFlights) return callback(null, forwardFlights);

				this.getForwardRoutePromise()
					.then((response) => callback(null, response.result))
					.catch((xhr, textStatus, errorThrown) => callback(xhr));
			},
			getReturnFlights: function(callback) {
				this.getReturnRoutePromise()
					.then((response) => callback(null, response.result))
					.catch((xhr, textStatus, errorThrown) => callback(xhr));
			}
		};

		return service;
	}
]);
appServices.factory('locationsService', [
	function() {

		var query = {
			from: null,
			to: null
		};

		var origins = null,
			destinations = null;

		//--------------------------------------------------------------------
		var getOriginsQuery = function() {

			var originsQuery = {};
			if (query.to) originsQuery.to = query.to;

			return originsQuery;
		};

		var originsPromiseParams = function(fullfill, reject) {	
			$.ajax({
				url: '/api/locations/origins',
				method: 'GET',
				data: getOriginsQuery(),
				success: fullfill,
				error: reject
			});
		};

		var originsPromise = null;

		//--------------------------------------------------------------------
		var getDestinationsQuery = function() {

			var destinationsQuery = {};
			if (query.from) destinationsQuery.from = query.from;

			return destinationsQuery;
		};

		var destinationsPromiseParams = function(fullfill, reject) {
			$.ajax({
				url: '/api/locations/destinations',
				method: 'GET',
				data: getDestinationsQuery(),
				success: fullfill,
				error: reject
			});
		};

		var destinationsPromise = null;

		//--------------------------------------------------------------------	
		var service = {

			getQuery: function() { return query; },
			setQuery: function(q) {
				
				if (q.to && q.to !== query.to) {
					query.to = q.to;
					origins = originsPromise = null;
				}

				if (q.from && q.from !== query.from) {
					query.from = q.from;
					destinations = destinationsPromise = null;
				}
			},

			getOriginsPromise: function() {

				if (!originsPromise || !origins) {

					originsPromise = new Promise(originsPromiseParams);

					originsPromise
						.then((response) => origins = response.result)
						.catch((xhr, textStatus, errorThrown) => origins = null);
				}

				return originsPromise;
			},
			getDestinationsPromise: function() {
				if (!destinationsPromise || !destinations) {

					destinationsPromise = new Promise(destinationsPromiseParams);

					destinationsPromise
						.then((response) => destinations = response.result)
						.catch((xhr, textStatus, errorThrown) => destinations = null);
				}

				return destinationsPromise;
			},

			getOrigins: function(params, callback) {

				this.setQuery(params);

				if (origins) return callback(null, origins);

				this.getOriginsPromise()
					.then((response) => callback(null, response.result))
					.catch((xhr, textStatus, errorThrown) => callback(xhr));
			},
			getDestinations: function(params, callback) {

				this.setQuery(params);

				if (destinations) return callback(null, destinations);

				this.getDestinationsPromise()
					.then((response) => callback(null, response.result))
					.catch((xhr, textStatus, errorThrown) => callback(xhr));
			}
		};

		return service;
	}
]);
appServices.factory('testService', [
	function() {
		
		var promiseParam = function(timeout) {

			return (fulfill, reject) => { setTimeout(() => fulfill(), timeout); };
		}; 

		var serviceObj = {
			foo: {message: 'Hello'},
			loadingPromise: function(timeout) { 
				var promise = new Promise(promiseParam(timeout))
								.then(() => { console.log('loading finished after', timeout, 'ms'); });
				return promise;
			}
		};

		return serviceObj;
	}
]);
appServices.factory('travelClassesService', [
	function() {

		var query = {};
		var travelClasses = null;

		//--------------------------------------------------------------------
		var getTravelClassesQuery = function() {

			var query = {};

			return query;
		};

		var travelClassesPromiseParams = function(fullfill, reject) {	
			$.ajax({
				url: '/api/travelclasses',
				method: 'GET',
				data: getTravelClassesQuery(),
				success: fullfill,
				error: reject
			});
		};

		var travelClassesPromise = null;

		//--------------------------------------------------------------------	
		var service = {

			getQuery: function() { return query; },
			setQuery: function(q) {

				travelClasses = travelClassesPromise = null;
			},

			getTravelClassesPromise: function() {

				if (!travelClassesPromise || !travelClasses) {

					travelClassesPromise = new Promise(travelClassesPromiseParams);

					travelClassesPromise
						.then((response) => travelClasses = response.result)
						.catch((xhr, textStatus, errorThrown) => travelClasses = null);
				}

				return travelClassesPromise; 
			},

			getTravelClasses: function(callback) {

				if (travelClasses) return callback(null, travelClasses);

				this.getTravelClassesPromise()
					.then((response) => callback(null, response.result))
					.catch((xhr, textStatus, errorThrown) => callback(xhr.responseJSON));
			}
		};

		return service;
	}
]);
appServices.factory('validateService', [
	function() {

		//--------------------------------------------------------------------
		
		var service = {

			validateContact: function(contact) {

				if (!contact.title) return false;
				if (!contact.firstName) return false;
				if (!contact.lastName) return false;
				if (!contact.email) return false;
				if (!contact.telephone) return false;

				return true;
			},
			validatePassenger: function(passenger) {
				if (!passenger.title) return false;
				if (!passenger.firstName) return false;
				if (!passenger.lastName) return false;
				if (!passenger.dateOfBirth) return false;
			},
			validatePassengers: function(passengers) {

				if (!passengers.adults || !passengers.children || !passengers.infants) return false;

				var adultsCount = passengers.adults.length, childrenCount = passengers.children.length, infantsCount = passengers.infants.length;
				if (adultsCount <= 0 || adultsCount > 6) return false;
				if (childrenCount < 0 || childrenCount > (2 * adultsCount) || childrenCount > (6 - adultsCount)) return false;
				if (infantsCount < 0 || infantsCount > adultsCount) return false;

				var failFlag = false;
				for(let i = 0; i < adultsCount; ++i) {
					if (this.validatePassenger(passengers.adults[i])) {
						failFlag = true;
						break;
					}
				}
				if (failFlag) return false;

				for(let i = 0; i < childrenCount; ++i) {
					if (this.validatePassenger(passengers.children[i])) {
						failFlag = true;
						break;
					}
				}
				if (failFlag) return false;

				for(let i = 0; i < infantsCount; ++i) {
					if (this.validatePassenger(passengers.infants[i])) {
						failFlag = true;
						break;
					}
				}
				if (failFlag) return false;


				return true;
			},
			validateFlight: function(flight) {
				if (!flight.seats) return false;
				return true;
			},
			validateTravelClass: function(travelClass) {
				return true;
			},
			validateBookingRoute: function(bookingRoute) {
				if (!bookingRoute.flight) return false;
				if (!bookingRoute.class) return false;

				if (!this.validateFlight(bookingRoute.flight)) return false;
				if (!this.validateTravelClass(bookingRoute.class)) return false;

				if (!bookingRoute.flight.seats.find((s) => s._class === bookingRoute.class._id)) return false;

				return true;
			}
		};

		return service;
	}
]);