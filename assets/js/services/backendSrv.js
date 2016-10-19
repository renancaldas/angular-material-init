'use strict';
var service = angular.module('srv.backend', [])

var testing = true;
var users = [
	{_id: 1, name: 'User1', email:'email@email1.com'},
	{_id: 2, name: 'User2', email:'email@email2.com'},
	{_id: 3, name: 'User3', email:'email@email3.com'},
	{_id: 4, name: 'User4', email:'email@email4.com'},
	{_id: 5, name: 'User5', email:'email@email5.com'}
];
var crudTimeout = 1000;

service.factory('backendSrv', function($q, $http, $timeout, lodash) {
    'use strict';
    var _ = lodash;

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
