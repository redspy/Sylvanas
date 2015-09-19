angular.module('starter.controllers')

    .factory('productTypeService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/product/:id', {}, {
            create: {
                method: 'POST'
            },
            read: {
                method: 'GET',
                isArray: true
            },
            modify: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);
