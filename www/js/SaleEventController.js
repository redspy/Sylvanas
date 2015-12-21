angular.module('starter.controllers')

    .controller('saleEventController', ['$scope', '$timeout', '$state', '$q', 'saleService', 'IMAGE_ENDPOINT', function ($scope, $timeout, $state, $q, saleService, IMAGE_ENDPOINT) {
        $scope.name = "할인 & 이벤트";
        $scope.detailLink = "#/app/saleevent/";

        $scope.MarketName = "강릉 중앙시장";

        $scope.items = [];
        //$scope.items = getData(10);
        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                // Refresh
                //$window.location.reload(true);
                //Stop the ion-refresher from spinning
                getStoreInformation(-1, 5).then(function (data) {
                    console.log(data);
                    $scope.items = data;
                });
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        /*
         * 상점 정보를 from에 지정된 id 상점을 기준으로 count만큼의 상점정보를 리턴한다.
         * 만일 count 만큼의 데이터가 없으면 있는 만큼만 리턴함.
         * from: -1일 경우 제일 마지막에 입력된 상점을 기준으로 출력함.
         * count: -1일 경우 from을 기준으로 모든 상점을 리턴한다.
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
        function getStoreInformation(from, count) {
            var deferred = $q.defer();

            saleService.readAll(
                {id:from, count:count},
                function (value, responseHeaders) {
                    deferred.resolve(value);
                }, function (httpResponse) {
                    deferred.reject(httpResponse)
                });

            return deferred.promise;
        }

        $scope.getImageURL = function (imageID) {
            return IMAGE_ENDPOINT + 'thumb/' + imageID;
        };

        $scope.loadMore = function () {
            getStoreInformation($scope.items.length - 1, 5).then(function (data) {
                console.log(22);
                if (data.length != 0) {
                    data.forEach(function (item) {
                        $scope.items.push(item);
                    });
                $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            })
        };

        getStoreInformation(-1, 5).then(function (data) {
            console.log(data);
            $scope.items = data;
        });

    }
    ]);
