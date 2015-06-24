angular.module('starter.controllers')

.controller('localinformationdetailcontroller', function ($scope, $stateParams) {
    $scope.name = "localinformationdetailcontroller";
    $scope.id = $stateParams.unitid;
});
