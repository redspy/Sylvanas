angular.module('starter.controllers')

.controller('adStoreController', function ($scope, $cordovaGeolocation) {
    $scope.name = "내가게 알리기";

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
        $scope.lat  = position.coords.latitude
        $scope.long = position.coords.longitude
        initialize();
    }, function(err) {
        // error
    });


    var watchOptions = {
        frequency : 1000,
        timeout : 3000,
        enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);

    watch.then(
        null,
        function(err) {
            // error
        },
        function(position) {
            $scope.lat  = position.coords.latitude
            $scope.long = position.coords.longitude
        });


    watch.clearWatch();

    // OR
    // $cordovaGeolocation.clearWatch(watch)
    // .then(function(result) {
    //     // success
    // }, function (error) {
    //     // error
    // });
    var initialize = function () {
        var myLatlng = new google.maps.LatLng($scope.lat, $scope.long);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });
        $scope.map = map;
    }
    google.maps.event.addDomListener(window, 'load', initialize);

});
