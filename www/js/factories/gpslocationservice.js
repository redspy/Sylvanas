/**
 * Created by utoxiz on 15. 12. 24..
 */
angular.module('starter.controllers')

    .factory('gpslocationservice', ['$q', function($q){
        var deferred = $q.defer();

        navigator.geolocation.getCurrentPosition(function(position){
                deferred.resolve(
                    {
                        lat : position.coords.latitude,
                        long : position.coords.longitude
                    }
                )
            },
            function (error){
                deferred.reject(error);
            } ,{ timeout : 3000 });

        return deferred.promise;
    }]);