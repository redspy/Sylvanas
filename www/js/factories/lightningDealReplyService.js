/**
 * Created by utoxiz on 15. 8. 27..
 */
angular.module('starter.controllers')

    .factory('lightningDealReplyService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/deal/reply/:id/:rid', {}, {
            create: {
                method: 'POST'
            },
            readAll: {
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