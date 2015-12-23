angular.module('starter.controllers')

.controller('localinformationdetailcontroller', ['$scope', '$stateParams', 'storeService', '$q', 'IMAGE_ENDPOINT', '$ionicSlideBoxDelegate', 'bookmarkStoreService', 'storeItem', function ($scope, $stateParams, storeService, $q, IMAGE_ENDPOINT, $ionicSlideBoxDelegate, bookmarkStoreService, storeItem) {
    $scope.name = '';
    $scope.id = $stateParams.unitid;
    $scope.item = [];
    $scope.images = [];
    $scope.myStar = false;

    $scope.getImageURL = function (imageID) {
        return IMAGE_ENDPOINT + imageID;
    };

    $scope.doSomething = function () {
        $scope.reply = "";
    };

    // 찜찜찜했는지 확인
    bookmarkStoreService.exists({
        id: $scope.id
    }, {}, function (data) {
        console.log('찜', data.result);
        $scope.myStar = data.result;
    });

    $scope.favoriteClick = function () {
        if (!$scope.myStar) {
            bookmarkStoreService.create({
                id: $scope.id
            }, {}, function () {
                $scope.myStar = true;
                $scope.showTop("찜 목록에 등록되었습니다.");
                $scope.item.BookmarkCount++;
            });
        } else {
            bookmarkStoreService.delete({
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
    $scope.showTop = function (messageString) {
        window.plugins.toast.showWithOptions({
            message: messageString,
            duration: "short",
            position: "bottom",
            addPixelsY: -40 // added a negative value to move it up a bit (default 0)
        });
    };

    $scope.images = [];
    $scope.item = storeItem.get();
    console.log($scope.item);

    $scope.item.lat = $scope.item.Latitude;
    $scope.item.long = $scope.item.Longitude;
    for (var i = 0; i < $scope.item.Images.length; i++) {
        $scope.images.push($scope.getImageURL($scope.item.Images[i]));
    }
    $scope.name = $scope.item.Name;
    $ionicSlideBoxDelegate.update();
    $scope.initialize();
    }]);
