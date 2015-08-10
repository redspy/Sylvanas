angular.module('starter.controllers')

.factory('authenticationService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
    return $resource(SERVICE_ENDPOINT + '/user', {}, {
        login: {
            method: 'POST'
        },
        isLoggedIn: {
            method: 'GET',
        },
        logout: {
            method: 'DELETE'
        }
    });
    }]);
