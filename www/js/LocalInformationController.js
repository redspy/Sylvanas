angular.module('starter.controllers')

.controller('localInformationController', ['$scope', '$timeout', '$state', 'storeService', '$q', 'IMAGE_ENDPOINT', 'productTypeService', 'storeSearchService', 'storeItem', 'gpslocationservice', function($scope, $timeout, $state, storeService, $q, IMAGE_ENDPOINT, productTypeService, storeSearchService, storeItem, gpslocationservice) {
    $scope.name = "주변 상점 정보";
    $scope.detailLink = "#/app/localinformation/";
    $scope.MarketName = "강릉 중앙시장";

    $scope.items = [];

    $scope.doRefresh = function() {
        $timeout(function() {
            //$scope.$broadcast('scroll.infiniteScrollComplete');

            gpslocationservice.location().then(function(position) {
                filterStoreByType($scope.searchProductType, position.lat, position.long, 0, 5).then(function(data) {
                    $scope.items = data;
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }, function(error) {
                filterStoreByType($scope.searchProductType, 37.7521565, 128.8759359, 0, 5).then(function(data) {
                    $scope.items = data;
                    $scope.$broadcast('scroll.refreshComplete');
                });
            });
        }, 1000);
    };

    $scope.searchProductType = -1;
    productTypeService.read(function(data) {
        $scope.productType = data;

        $scope.$watch('searchProductType', function(nv) {
            gpslocationservice.location().then(function(position) {
                filterStoreByType(nv, position.lat, position.long, 0, 5).then(function(data) {
                    $scope.items = data;
                });
            }, function(error) {
                filterStoreByType(nv, 37.7521565, 128.8759359, 0, 5).then(function(data) {
                    $scope.items = data;
                });
            });
        });
    });

    $scope.loadMore = function() {
        console.log(1);

        gpslocationservice.location().then(function(position) {
            filterStoreByType($scope.searchProductType, position.lat, position.long, $scope.items.length, 5).then(function(data) {
                if (data.length != 0) {
                    data.forEach(function(item) {
                        $scope.items.push(item);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
        }, function(error) {
            filterStoreByType($scope.searchProductType, 37.7521565, 128.8759359, $scope.items.length, 5).then(function(data) {
                if (data.length != 0) {
                    data.forEach(function(item) {
                        $scope.items.push(item);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
        });
    };

    /*
     * type에 해당하는 상점 정보를 리턴한다. 이때 (latitude, longtitude)에서 가장 가까운 순서로
     * 리턴한다. type이 -1인 경우 모든 품목에 대해 검색한다.
     */
    function filterStoreByType(type, latitude, longitude, from, count) {
        var deferred = $q.defer();

        storeSearchService.search({
                type: type,
                latitude: latitude,
                longitude: longitude,
                from: from,
                count: count
            },
            function(value, responseHeaders) {
                deferred.resolve(value);
            },
            function(httpResponse) {
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

        storeService.readAll({
                id: from,
                count: count
            },
            function(value, responseHeaders) {
                deferred.resolve(value);
            },
            function(httpResponse) {
                deferred.reject(httpResponse)
            });

        return deferred.promise;
    }

    $scope.getImageURL = function(imageID) {
        return IMAGE_ENDPOINT + 'thumb/' + imageID;
    };

    $scope.showDetail = function(item) {
        storeItem.store(item);
        $state.go('app.localinformationdetail', {
            unitid: item.Id
        });
    }
}]);
