'use strict';
var app = angular.module('AngularApp', [
    // Controllers & services 
    'ctrl.global',
    'ctrl.welcome',
    'srv.global', 

    // Angular 
    'ngMaterial', 
    'ngRoute'
]);

app.config(function($mdThemingProvider, $routeProvider, $sceDelegateProvider) {

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
          templateUrl: 'assets/views/welcome.html',
          controller: 'WelcomeCtrl'
        })
      	
        .otherwise({redirectTo : '/'});


    
});

