/**
 * Created by utoxiz on 15. 8. 27..
 */
angular.module('starter.controllers')

    .factory('bookmarkSaleService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/bookmark/sale/:id', {}, {
            create: {
                method: 'POST'
            },
            delete: {
                method: 'DELETE'
            },
            exists: {
                method: 'GET'
            }
        });
    }]);