angular.module('starter.controllers')

.controller('localInformationController', function ($scope, $timeout) {
    $scope.name = "주변 상점 정보";

    $scope.doRefresh = function () {
        $timeout(function () {
            //simulate async response
            // Refresh
            //$window.location.reload(true);
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);
    };
});