/**
 * Created by 영태 on 2015-08-29.
 */
angular.module('starter.controllers')

    .factory('certService', ['$q', '$http', 'SERVICE_ENDPOINT', function ($q, $http, SERVICE_ENDPOINT) {
        'use strict';
        var deferred = $q.defer();

        $http.get(SERVICE_ENDPOINT + '/cert').then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }]);