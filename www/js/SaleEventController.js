angular.module('starter.controllers')

    .controller('saleEventController', ['$scope', '$timeout', '$state', function ($scope, $timeout, $state) {
        $scope.name = "할인 & 이벤트";

        $scope.heights = [225, 300, 375, 450];
        $scope.widths = [75, 150, 225, 300, 375, 450, 500];
        $scope.PictureType = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport'];
        $scope.items = [];

        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                // Refresh
                //$window.location.reload(true);
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

        $scope.getRandomItem = function (arrObject){
            var rndIndex = Math.floor((Math.random() * arrObject.length) + 1);
            return arrObject[rndIndex - 1];
        };

        $scope.getData = function (amount) {
            var rndIndex = Math.floor((Math.random() * 10000));
            if (rndIndex < 2000) {
                rndIndex = null;
            }

            var item = {};
            item = {
                id: 'Pic' + amount,
                pictureType: $scope.getRandomItem($scope.PictureType),
                height: $scope.getRandomItem($scope.heights),
                marketname: "강릉 중앙시장",
                name: "홍콩반점",
                favoritcount: "3",
                category: "짱깨",
                phone: "010-6521-6240",
                address: "강원도 강릉시 짜장면",
                enddate: rndIndex,
                width: 400
            };
            return item;
        };

        $scope.loadMore = function () {
            for (var i = 0; i < 10; i++) {
                $scope.items.push($scope.getData($scope.items.length));
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.$on('$stateChangeSuccess', function () {
            if ($state.is('app.saleevent')) {
                $scope.loadMore();
            }
        });
    }]);
