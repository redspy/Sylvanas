angular.module('starter.controllers')

.provider('pushService', [function () {
    'use strict';

    var option = {};
    var successCallback = function () {};
    var errorCallback = function () {};
    var tokenCallback = function () {};
    var notificationCallback = function () {};
    
    return {
        setup: function (o, nCallback, sCallback, eCallback, tCallback) {
            option = o || {};
            notificationCallback = nCallback || function () {console.log('Ncallback')};
            successCallback = sCallback || function () {console.log('Scallback')};
            errorCallback = eCallback || function () {console.log('Ecallback')};
            tokenCallback = tCallback || function () {console.log('Tcallback')};
        },

        $get: function ($q, $window) {
            var tokenDeferred = $q.defer();
            
            function onToken(token) {
                tokenDeferred.resolve(token);
                tokenCallback(token);
            }
            
            $window.onPushNotification = function (event) {
                if (ionic.Platform.platform().toUpperCase() === 'ANDROID') {
                    if (event.event === 'registered') {
                        onToken(event.regid);
                    } else {
                        notificationCallback(event);
                    }
                } else {
                    notificationCallback(event);
                }
            }    
            
            ionic.Platform.ready(function () {
                option.ecb = 'window.onPushNotification';

                switch (ionic.Platform.platform().toUpperCase()) {
                    case 'ANDROID':
                        $window.plugins.pushNotification.register(successCallback, errorCallback, option);
                        break;
                    case 'IOS':
                        $window.plugins.pushNotification.register(onToken, errorCallback, option);
                        break;
                    default:
                        onToken(ionic.Platform.platform().toUpperCase() + '_DEBUG_TOKEN');

                }
            });

            return {
                getToken: function () {
                    return tokenDeferred.promise;
                }
            };
        }
    };
}]);