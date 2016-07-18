'use strict';
var ctrlModule = angular.module('ctrl.welcome', []);

ctrlModule.controller('WelcomeCtrl', function($rootScope, $scope, globalSrv) {

  /* Main functions
  ----------------------*/
  function init() {
        $scope.messageFromService = globalSrv.getWelcomeMessage();
        $scope.messageFromController =  'I have been passed through "welcomeCtrl.js"';
  }

  function events() {

      $scope.clickme = function () {
          alert('Yay! I fired an event at welcomeCtrl!');
      }
  }
  
  init();
  events();
});