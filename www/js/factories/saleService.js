/**
 * Created by 영태 on 2015-08-11.
 */
angular.module('starter.controllers')

    .factory('saleService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/sales/:id/:count', {}, {
            create: {
                method: 'POST'
            },
            readAll: {
                method: 'GET',
                isArray: true
            },
            read: {
                method: 'GET'
            },
            modify: {
                method: 'POST'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);
