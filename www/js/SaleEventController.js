angular.module('starter.controllers')

    .controller('saleEventController', ['$scope', '$timeout', '$state', '$q', 'saleService', function ($scope, $timeout, $state, $q, saleService) {
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
                //favoritcount: "3",
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

        /*
         * 할인 정보를 from에 지정된 id 이벤트를 기준으로 count만큼의 할인 정보를 리턴한다.
         * 만일 count 만큼의 데이터가 없으면 있는 만큼만 리턴함.
         * from: -1일 경우 제일 마지막에 입력된 할인 정보를 기준으로 출력함.
         * count: -1일 경우 from을 기준으로 모든 할인 정보를 리턴한다.
         * data Sample
         * {
         "Id": 15,
         "Name": "상호명",
         "Address": "주소",
         "Contact": "031-254-7852",
         "Product": "품목",
         "Description": "소개",
         "GPS": "37.548, 127.5",
         "CreateDate": "2015-08-11T06:39:04Z",
         "Images": [35, 36]
         }
         * */
        function getSaleInformation(from, count) {
            var deferred = $q.defer();

            saleService.readAll(
                {id:from, count:count},
                function (value) {
                    deferred.resolve(value);
                }, function (httpResponse) {
                    deferred.reject(httpResponse)
                });

            return deferred.promise;
        }

        getSaleInformation(-1, 1).then(function (data) {
            console.log(data);
        });
    }]);
