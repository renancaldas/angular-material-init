'use strict';
var ctrlModule = angular.module('ctrl.global', []);

ctrlModule.controller('GlobalCtrl', function($rootScope, $scope, $mdSidenav, $location, globalSrv) {

  /* Main functions
  ----------------------*/
  function init() {
        $scope.sideNav = {
            show: false,
            items: ['Menu 1', 'Menu 2']
        };

        $scope.header = {
            title: 'Angular app title',
            showBackButton: false,
            showMenuButton: true
        }
  }

  function events() {

      $scope.goToView = function (url) { $location.path(url); $mdSidenav('leftMenu').close(); }
      $scope.toggleSideNav = function() { $mdSidenav('leftMenu').toggle(); };
      $scope.clickme = function () { alert('Yay! I fired an event at globalCtrl!'); }
  }
  
  init();
  events();
});

