angular.module('starter.controllers')

.factory('bannerService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
    return $resource(SERVICE_ENDPOINT + '/banners/:id', {}, {
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
