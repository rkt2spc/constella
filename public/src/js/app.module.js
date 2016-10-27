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

