/**
 * Created by utoxiz on 15. 9. 7..
 */
angular.module('starter.controllers')

    .controller('settingController', ['$scope', function ($scope) {
        $scope.name = "설정";

        $scope.regionValue = 1;
        $scope.notificationMode = false;
        $scope.notificationCheck = function () {
            if ($scope.notificationMode == true) {
                $scope.notificationMode = false;
                backgroundGeoLocation.stop();
            }
            else {
                $scope.notificationMode = true;
                backgroundGeoLocation.start();
            }

            console.log($scope.notificationMode);
        }
    }]);
