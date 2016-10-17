'use strict';
var ctrlModule = angular.module('ctrl.crud', []);

ctrlModule.controller('CrudCtrl', function($rootScope, $scope, backendSrv) {

	/* Main functions
	----------------------*/
	function init() {
		$scope.tableCrud = {
			loading: true,
			name: 'User',
			dialogTemplate: 'crudTestTemplate.html',
			backendUrl: 'http://localhost:3000/user',
			fields: [
				{name: 'Id', model: '_id'},
				{name: 'Name', model: 'name'},
				{name: 'Email', model: 'email'}
			]
		};

		backendSrv.getList('http://localhost:3000').then(function (users) {
			console.log(users);
			$scope.tableCrud.list = users;
			$scope.tableCrud.loading = false;
		});

		
		
		/*
		backendSrv.user.getList().then(function (userList) {
			$scope.userList = userList;
		});
		*/
	}

	function events() {

	}

	init();
	events();
});