'use strict';
var service = angular.module('srv.global', [])


service.factory('globalSrv', function() {
    'use strict';

    return {
    		getWelcomeMessage: function () {
    			return 'Welcome from "globalSrv.js"'
    		}
    }
});
