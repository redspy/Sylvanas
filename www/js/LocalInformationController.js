angular.module('starter.controllers')

.controller('localInformationController', function ($scope, $ionicModal, $timeout) {
    $scope.name = "주변 상점 정보";
    

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/AddAdStore.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeWrite = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.write = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doWrite = function () {
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeWrite();
        }, 1000);
    };
    

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