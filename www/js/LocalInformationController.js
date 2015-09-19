angular.module('starter.controllers')

    .controller('localInformationController', ['$scope', '$timeout', '$state', 'storeService', '$q', 'IMAGE_ENDPOINT', 'productTypeService', 'storeSearchService', function ($scope, $timeout, $state, storeService, $q, IMAGE_ENDPOINT, productTypeService, storeSearchService) {
        $scope.name = "주변 상점 정보";
        $scope.detailLink = "#/app/localinformation/";
        $scope.MarketName = "강릉 중앙시장";

        $scope.items = [];
        //$scope.items = getData(10);
        /*
        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                // Refresh
                //$window.location.reload(true);
                //Stop the ion-refresher from spinning
                getStoreInformation(-1, -1).then(function (data) {
                    console.log(data);
                    $scope.items = data;
                });


                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };*/

        productTypeService.read(function (data) {
            $scope.productType = data;
        });

        $scope.searchProductType = -1;
        $scope.$watch('searchProductType', function (nv) {
            filterStoreByType(nv, 37.5, 127.5).then(function (data) {
               $scope.items = data;
            });
        });

        //$scope.loadMore = function () {
        //
        //    var startIndex = $scope.items.length;
        //
        //    for (var i = startIndex; i < 10; i++) {
        //        $scope.items.push(getStoreInformation(i-1, i));
        //    }
        //    $scope.$broadcast('scroll.infiniteScrollComplete');
        //};
        //
        //$scope.$on('$stateChangeSuccess', function () {
        //    if ($state.is('app.localinformation')) {
        //        $scope.loadMore();
        //    }
        //});

        /*
         * type에 해당하는 상점 정보를 리턴한다. 이때 (latitude, longtitude)에서 가장 가까운 순서로
         * 리턴한다. type이 -1인 경우 모든 품목에 대해 검색한다.
         */
        function filterStoreByType(type, latitude, longitude) {
            var deferred = $q.defer();

            storeSearchService.search(
                {type:type, latitude:latitude, longitude:longitude},
                function (value, responseHeaders) {
                    deferred.resolve(value);
                }, function (httpResponse) {
                    deferred.reject(httpResponse)
                });

            return deferred.promise;
        }

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

            storeService.readAll(
                {id:from, count:count},
                function (value, responseHeaders) {
                    deferred.resolve(value);
                }, function (httpResponse) {
                    deferred.reject(httpResponse)
            });

            return deferred.promise;
        }

        getStoreInformation(-1, -1).then(function (data) {
            console.log(data);
            $scope.items = data;
        });

        $scope.getImageURL = function (imageID) {
            return IMAGE_ENDPOINT + 'thumb/' + imageID;
        };
    }
    ]);
