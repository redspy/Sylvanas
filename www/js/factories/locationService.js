/**
 * Created by Spencer Roh on 2015-11-07.
 */
angular.module('starter.controllers')

    .factory('locationService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/location', {}, {
            inform: {
                method: 'POST'
            }
        });
    }]);