angular.module('starter.controllers')

    .controller('favoritesController', ['$scope', function ($scope) {
        $scope.name = "내 찜 목록";

        function alertDismissed() {
            // do something
        }

        $scope.notification = function () {
            navigator.notification.beep();
            navigator.notification.vibrate(2000);
            navigator.notification.alert(
                'You are the winner!',  // message
                alertDismissed,         // callback
                'Game Over',            // title
                'Done'                  // buttonName
            );
        };
    }]);
