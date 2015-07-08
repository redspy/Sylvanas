angular.module('starter.controllers')

.controller('localInformationController', ['$scope', '$timeout', '$state', function ($scope, $timeout, $state) {
    $scope.name = "주변 상점 정보";

    var heights = [225, 300, 375, 450];
    var widths = [75, 150, 225, 300, 375, 450, 500];
    var PictureType = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport'];
    $scope.items = [];
    //$scope.items = getData(10);
    $scope.doRefresh = function () {
        $timeout(function () {
            //simulate async response
            // Refresh
            //$window.location.reload(true);
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);
    };

    function getRandomItem(arrObject) {
        var rndIndex = Math.floor((Math.random() * arrObject.length) + 1);
        return arrObject[rndIndex - 1];
    }

    function getData(amount) {
        var item = {};
        item = {
            id: 'Pic' + amount,
            pictureType: getRandomItem(PictureType),
            height: getRandomItem(heights),
            marketname : "강릉 중앙시장",
            name : "홍콩반점",
            favoritcount : "3",
            category : "짱깨",
            phone : "010-6521-6240",
            address : "강원도 강릉시 짜장면",
            width: 400
        };
        return item;
    }

    $scope.loadMore = function() {
        for (var i = 0; i < 10; i++) {
            $scope.items.push(getData($scope.items.length));
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.$on('$stateChangeSuccess', function() {
        if ($state.is('app.localinformation')) {
            $scope.loadMore();
        }
    });
}
]);
