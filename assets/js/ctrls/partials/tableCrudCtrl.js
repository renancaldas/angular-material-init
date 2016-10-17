'use strict';
var ctrlModule = angular.module('ctrl.tableCrud', []);

ctrlModule.controller('TableCrudCtrl', function($rootScope, $scope, $q, $mdDialog, $mdToast, backendSrv) {

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
							backendSrv.edit(url, data, id).then(function(){ 
							    $scope.loading = false;
							    $mdDialog.hide($scope.modalData.model); 
							}, function(err){
							    $scope.loading = false;
		    					    $mdToast.show($mdToast.simple().content('Error: ' + err.message));
							});
						}
						else {
							$scope.loading = true;
							backendSrv.create(url, data).then(function(){ 
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

				backendSrv.delete(url, id).then(function(){ 
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