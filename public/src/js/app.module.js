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

