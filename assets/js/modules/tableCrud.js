'use strict';
var tableCrudModule = angular.module('tableCrud', ['ngMaterial', 'ngLodash']);

tableCrudModule.config(function($sceDelegateProvider) {

    // Whitelist cdn.rawgit.com
    $sceDelegateProvider.resourceUrlWhitelist([
      'self', // Allow same origin resource loads.
      'https://raw.githubusercontent.com/**' // Allow loading from our assets domain.  Notice the difference between * and **.
    ]);

});

tableCrudModule.directive('tableCrud', function() {
  return { 
    restrict: 'E',
    scope: {
      tableCrud: '=model'
    },
    templateUrl: function(elem, attr) {
      return 'https://raw.githubusercontent.com/renancaldas/angular-material-init/master/assets/views/partials/tableCrud.html';
    }
  };
});

tableCrudModule.controller('TableCrudCtrl', function($rootScope, $scope, $q, $mdDialog, $mdToast, tableCrudSrv) {
  'use strict';

  	var _helpers = {
		open: function (ev, model) {
			var deferred = $q.defer();

			// Validations
			if(!$scope.tableCrud || !$scope.tableCrud.name) 
				throw 'Modal variable "$scope.tableCrud.name" is not defined.';
			else if(!$scope.tableCrud || !$scope.tableCrud.dialogTemplate) 
				throw 'Modal variable "$scope.tableCrud.dialogTemplate" is not defined.';
			else if(!$scope.tableCrud || !$scope.tableCrud.backendUrl) 
				throw 'Modal variable "$scope.tableCrud.backendUrl" is not defined.';
			else {
				$scope.tableCrud.model = model;

				$mdDialog.show({
				     templateUrl: 'tableCrudDialog.html',
				     parent: angular.element(document.body),
				     targetEvent: ev,
				     clickOutsideToClose: true,
				     resolve: { modalData: function () { return $scope.tableCrud; } },
				     controller: function ($scope, modalData) {
				         var isUpdate = modalData.model ? true : false;
				         $scope.modalData = modalData;
				         $scope.modalData.model = isUpdate ? angular.copy(modalData.model) : {};
				         $scope.title = (isUpdate ? 'Edit '  : 'New ') + $scope.modalData.name;
				         $scope.loading = false;

				         $scope.cancel = function() { $mdDialog.cancel(); };
				         $scope.confirm = function() { 
							var url = modalData.backendUrl;
							var id = $scope.modalData.model._id;
							var data = $scope.modalData.model;

							if(isUpdate) {
								$scope.loading = true;
								tableCrudSrv.edit(url, data, id).then(function(){ 
								    $scope.loading = false;
								    $mdDialog.hide($scope.modalData.model); 
								}, function(err){
								    $scope.loading = false;
			    					    $mdToast.show($mdToast.simple().content('Error: ' + err.message));
								});
							}
							else {
								$scope.loading = true;
								tableCrudSrv.create(url, data).then(function(){ 
								    $scope.loading = false;
								    $mdDialog.hide($scope.modalData.model); 
								}, function(err){
								    $scope.loading = false;
			    					    $mdToast.show($mdToast.simple().content('Error: ' + err.message));
								});
							}
				         };

				     }
				}).then(function(server) {
				     deferred.resolve(server);
				});
			}

			return deferred.promise;
		},
		askDelete: function (ev, model) {

			if(!$scope.tableCrud || !$scope.tableCrud.backendUrl) 
				throw 'Modal variable "$scope.tableCrud.backendUrl" is not defined.';
			else {
				var deferred = $q.defer();

				var confirm = $mdDialog.confirm({
					title: 'Alert',
					ariaLabel: 'Alert',
					content: 'Would you like to delete?',
					clickOutsideToClose: true,
					ok: 'Yes',
					cancel: 'Cancel',
					targetEvent: ev
				});

				$mdDialog.show(confirm).then(function (confirm) {
					var url = $scope.tableCrud.backendUrl;
					var id = model._id;

					tableCrudSrv.delete(url, id).then(function(){ 
						$mdDialog.hide(model); 
						deferred.resolve(model);
					});
				})


				return deferred.promise;
			}
		},
		alert: function (title, message, ev) {
			var diag = $mdDialog.alert({
				title: title,
				ariaLabel: '',
				content: message,
				clickOutsideToClose: true,
				ok: 'Close',
				targetEvent: ev
			});

			$mdDialog.show(diag);
			}
		}

		/* Main functions
		----------------------*/
		function init() {
		 
		}

		function events() {
			$scope.add = function (ev) {
				_helpers.open(ev, null).then(function(created){
				    $mdToast.show($mdToast.simple().content(created.name + ' added successfully!'));
				})
			}

			$scope.update = function (ev, model) {
				_helpers.open(ev, model).then(function(updated){
				    $mdToast.show($mdToast.simple().content(updated.name + ' updated successfully!'));
				})
			}

			$scope.delete = function (ev, model) {
				_helpers.askDelete(ev, model).then(function(deleted){
				    $mdToast.show($mdToast.simple().content(deleted.name + ' deleted successfully!'));
				});
			}
		}

		init();
		events();
	});


tableCrudModule.factory('tableCrudSrv', function($q, $http, $timeout, lodash) {
	'use strict';
	var _ = lodash;

	var testing = true;
	var users = [
		{_id: 1, name: 'User1', email:'email@email1.com'},
		{_id: 2, name: 'User2', email:'email@email2.com'},
		{_id: 3, name: 'User3', email:'email@email3.com'},
		{_id: 4, name: 'User4', email:'email@email4.com'},
		{_id: 5, name: 'User5', email:'email@email5.com'}
	];
	var crudTimeout = 1000;
	
	return {
			getList: function(url) {
	          var deferred = $q.defer();

	          if(!testing) {
	              $http.get(url)
	                 .success(function(data, status, headers, config) { deferred.resolve(data); })
	                 .error(function(data, status, headers, config) { deferred.reject(data); });
			}
			else {
				$timeout(function(){
					deferred.resolve(users);
				}, crudTimeout)
			}

	          return deferred.promise;
	     },
	     create: function(url, data) {
	         var deferred = $q.defer();

	         	if(!testing) {
	               $http.post(url, data)
	                 .success(function(data, status, headers, config) { deferred.resolve(data); })
	                 .error(function(data, status, headers, config) { deferred.reject(data); });
	          }
	          else {
	               $timeout(function(){
	               	data._id = users.length+1;
	                	users.push(data);
					deferred.resolve();
				}, crudTimeout)
			}

	         return deferred.promise;
	     },
	     edit: function(url, data, id) {
	         var deferred = $q.defer();

	         	if(!testing) {
	               $http.put(url, data)
	                 .success(function(data, status, headers, config) { deferred.resolve(data); })
	                 .error(function(data, status, headers, config) { deferred.reject(data); });
	          }
	          else {
	              	$timeout(function() {
	              		var index = _.findIndex(users, {'_id': id});
	                	users[index] = data;
					deferred.resolve();
				}, crudTimeout)
			}

	         	return deferred.promise;
	     },
	     delete: function(url, id) {
	         	var deferred = $q.defer();

	        	if(!testing) {
	               $http.delete(url)
	                 .success(function(data, status, headers, config) { deferred.resolve(data); })
	                 .error(function(data, status, headers, config) { deferred.reject(data); });
	          }
	          else {
	          	console.log(id);
	              	$timeout(function(){
	              		var index = _.findIndex(users, {'_id': id});
	                	users.splice(index, 1);
					deferred.resolve();
				}, crudTimeout)
			}

	         return deferred.promise;
	     }
	}
});
