'use strict';
var app = angular.module('AngularApp', [
    // Controllers & services 
    'ctrl.global',
    'ctrl.welcome',
    'ctrl.crud',
    'ctrl.tableCrud', 

    // Services
    'srv.global', 
    'srv.backend', 
    'srv.modal', 

    // Angular 
    'ngMaterial', 
    'ngRoute',

    // Custom
    'md.data.table',
    'ngLodash'
]);

app.config(function($mdThemingProvider, $routeProvider, $sceDelegateProvider) {

    // Whitelist rawcdn.githack.com
    $sceDelegateProvider.resourceUrlWhitelist([
      'self', // Allow same origin resource loads.
      'https://rawcdn.githack.com/**' // Allow loading from our assets domain.  Notice the difference between * and **.
    ]);

	  // Theming
    // https://material.angularjs.org/latest/Theming/01_introduction
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('purple')
      .warnPalette('red');

    // Routes
    // https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
  	$routeProvider

        // Welcome
        .when('/', {
          templateUrl: 'https://rawcdn.githack.com/renancaldas/angular-material-init/gh-pages/assets/views/welcome.html',
          controller: 'WelcomeCtrl'
        })
        .when('/crud', {
          templateUrl: 'https://rawcdn.githack.com/renancaldas/angular-material-init/gh-pages/assets/views/crud.html',
          controller: 'CrudCtrl'
        })
      	
        .otherwise({redirectTo : '/'});


    
});

app.directive('tableCrud', function() {
  return { 
    restrict: 'E',
    scope: {
      tableCrud: '=model'
    },
    templateUrl: function(elem, attr) {
      return 'https://rawcdn.githack.com/renancaldas/angular-material-init/gh-pages/assets/views/partials/tableCrud.html';
    }
  };
});
