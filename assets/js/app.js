'use strict';
var app = angular.module('AngularApp', [
    // Controllers & services 
    'ctrl.global',
    'ctrl.welcome',
    'ctrl.crud',

    // Services
    'srv.global', 
    'srv.backend',

    // Angular 
    'ngMaterial', 
    'ngRoute',

    // Custom
    'md.data.table',
    'ngLodash',
    'tableCrud'
]);

app.config(function($mdThemingProvider, $routeProvider) {

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
        .when('/crud', {
          templateUrl: 'assets/views/crud.html',
          controller: 'CrudCtrl'
        })
      	
        .otherwise({redirectTo : '/'});


    
});
