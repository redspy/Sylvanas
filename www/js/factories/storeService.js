/**
 * Created by ���� on 2015-08-11.
 */
angular.module('starter.controllers')

    .factory('storeService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        var base = $resource(SERVICE_ENDPOINT + '/store/:id/:count', {}, {
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

        return base;
    }])
    .factory('storeSearchService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        var search = $resource(SERVICE_ENDPOINT + '/store/type/:type/gps/:latitude/:longitude/filter/:from/:count', {}, {
            search: {
                method: 'GET',
                isArray: true
            }
        });

        return search;
    }]);
