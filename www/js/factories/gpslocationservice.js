/**
 * Created by utoxiz on 15. 12. 24..
 */
angular.module('starter.controllers')

.factory('gpslocationservice', ['$q', function($q) {
    return {
        location: function() {
            var deferred = $q.defer();

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    console.log('gps success', position);
                    deferred.resolve({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    })
                },
                function(error) {
                    console.log('gps error', error);
                    deferred.reject(error);
                }, {
                    timeout: 3000
                });

            return deferred.promise;
        }
    }
}]);
