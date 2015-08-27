/**
 * Created by utoxiz on 15. 8. 27..
 */
angular.module('starter.controllers')

    .factory('bookmarkService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/bookmark/', {}, {
            readAll: {
                method: 'GET'
            }
        });
    }]);