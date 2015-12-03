angular.module('starter.controllers')

    .factory('introShopService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/intro/:id/:count', {}, {
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
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);

