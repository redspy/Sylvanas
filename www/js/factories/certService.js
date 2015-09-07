/**
 * Created by 영태 on 2015-08-29.
 */
angular.module('starter.controllers')

    .factory('certService', ['$http', 'SERVICE_ENDPOINT', function ($http, SERVICE_ENDPOINT) {
        'use strict';
        return $http.get(SERVICE_ENDPOINT + '/cert');
    }]);