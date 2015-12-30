/**
 * Created by utoxiz on 15. 9. 7..
 */
angular.module('starter.controllers')

    .controller('settingController', ['$scope', function ($scope) {
        $scope.name = "설정";

        $scope.regionValue = 1;
        $scope.notificationMode = window.backgroundGeoLocationOn;
        $scope.notificationCheck = function () {
            if ($scope.notificationMode == true) {
                $scope.notificationMode = false;
                backgroundGeoLocation.stop();
                window.backgroundGeoLocationOn = false;
            }
            else {
                $scope.notificationMode = true;
                backgroundGeoLocation.start();
                window.backgroundGeoLocationOn = true;
            }

            console.log($scope.notificationMode);
        }
    }]);
