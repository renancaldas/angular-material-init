'use strict';
var service = angular.module('srv.modal', [])

service.factory('modalSrv', function ($mdDialog, $mdToast, $q, backendSrv) {
    return {
		open: function (modalData, ev) {
			var deferred = $q.defer();

			// Validations
			if(!modalData || !modalData.name) 
				throw 'modalz variable "modalData.name" is not defined.';
			else {
				$mdDialog.show({
				     templateUrl: 'tableCrudDialog.html',
				     parent: angular.element(document.body),
				     targetEvent: ev,
				     clickOutsideToClose: true,
				     resolve: { modalData: function () { return modalData; } },
				     controller: function ($scope, modalData) {
				         var isUpdate = modalData.model ? true : false;
				         console.log(modalData);
				         $scope.modalData = modalData;
				         $scope.modalData.model = isUpdate ? angular.copy(modalData.model) : {};
				         $scope.title = (isUpdate ? 'Edit '  : 'New ') + $scope.modalData.name;
				         $scope.loading = false;

				         $scope.cancel = function() { $mdDialog.cancel(); };
				         $scope.confirm = function() { 
							if(isUpdate) {
								$scope.loading = true;
								fireService.getModel($scope.modalData.name).edit($scope.modalData.model).then(function(){ 
								    $mdDialog.hide($scope.modalData.model); 
								    $scope.loading = false;
								});
							}
							else {
								$scope.loading = true;
								fireService.getModel($scope.modalData.name).create($scope.modalData.model).then(function(){ 
								    $scope.loading = false;
								    $mdDialog.hide($scope.modalData.model); 
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
		askDelete: function (modelName, model, title, message, ev) {
			var deferred = $q.defer();

			console.log(model);

			var confirm = $mdDialog.confirm({
				title: 'Alert',
				ariaLabel: 'Alert',
				content: message,
				clickOutsideToClose: true,
				ok: 'Yes',
				cancel: 'Cancel',
				targetEvent: ev
			});

			$mdDialog.show(confirm).then(function (confirm) {
				fireService.getModel(modelName).delete(model).then(function(){ 
					$mdDialog.hide(model); 
					deferred.resolve(model);
				});
			})

			return deferred.promise;
		},
		alert: function (title, message, ev) {
			var diag = $mdDialog.alert({
				title: 'App key',
				ariaLabel: 'App key',
				content: message,
				clickOutsideToClose: true,
				ok: 'Close',
				targetEvent: ev
			});

			$mdDialog.show(diag);
		}
    };
});