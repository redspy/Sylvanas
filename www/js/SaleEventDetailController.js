/**
 * Created by utoxiz on 15. 8. 16..
 */
angular.module('starter.controllers')

    .controller('saleeventdetailcontroller', ['$scope', '$stateParams', 'saleService', '$q', 'IMAGE_ENDPOINT', '$ionicSlideBoxDelegate', 'bookmarkSaleService', function ($scope, $stateParams, saleService, $q, IMAGE_ENDPOINT, $ionicSlideBoxDelegate, bookmarkSaleService) {
        $scope.name = "";
        $scope.id = $stateParams.unitid;
        $scope.item = [];
        $scope.images = [];
        $scope.myStar = false;
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
                function (value) {
                    deferred.resolve(value);
                }, function (httpResponse) {
                    deferred.reject(httpResponse)
                });

            return deferred.promise;
        }

        getStoreInformation($scope.id, 1).then(function (data) {
            console.log(data);
            $scope.images = [];
            $scope.item = data[0];

            $scope.item.lat = $scope.item.Latitude;
            $scope.item.long = $scope.item.Longitude;
            for (var i = 0; i < $scope.item.Images.length; i++) {
                $scope.images.push($scope.getImageURL($scope.item.Images[i]));
                //$scope.images[i].url = $scope.getImageURL($scope.item.Images[i]);
            }
            $scope.name = $scope.item.Name;
            $ionicSlideBoxDelegate.update();
            $scope.initialize();
        });

        $scope.getImageURL = function (imageID) {
            return IMAGE_ENDPOINT + imageID;
        };

        $scope.doSomething = function () {
            $scope.reply = "";
        };

        // 찜찜찜했는지 확인
        bookmarkSaleService.exists({
            id: $scope.id
        }, {}, function (data) {
            console.log('찜', data.result);
            $scope.myStar = data.result;
        });

        $scope.favoriteClick = function () {
            if (!$scope.myStar) {
                bookmarkSaleService.create({
                    id: $scope.id
                }, {}, function () {
                    $scope.myStar = true;
                    $scope.showTop("찜 목록에 등록되었습니다.");
                    $scope.item.BookmarkCount++;
                });
            } else {
                bookmarkSaleService.delete({
                    id: $scope.id
                }, {}, function () {
                    $scope.myStar = false;
                    $scope.showTop("찜을 취소하였습니다.");
                    $scope.item.BookmarkCount--;
                });
            }
        };

        $scope.callClick = function () {
            window.open('tel:' + $scope.item.Contact);
        };

        $scope.initialize = function () {
            var myLatlng = new google.maps.LatLng($scope.item.lat, $scope.item.long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                draggable: false,
                zoomControl: false,
                streetViewControl: false,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                scaleControl: false,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Uluru (Ayers Rock)'
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
            $scope.map = map;
        };
        // google.maps.event.addDomListener(window, 'load', $scope.initialize);

        $scope.showTop = function(messageString) {
            window.plugins.toast.showWithOptions(
                {
                    message: messageString,
                    duration: "short",
                    position: "bottom",
                    addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                }
            );
        };
    }]);
