angular.module('starter.controllers')

    .controller('localinformationdetailcontroller', ['$scope', '$stateParams', function ($scope, $stateParams) {
        $scope.name = "localinformationdetailcontroller";
        $scope.id = $stateParams.unitid;

        $scope.doSomething = function () {
            $scope.reply = "";
        };

        $scope.images = [
            {
                url: 'example1.jpg'
            },
            {
                url: 'example2.jpg'
            },
            {
                url: 'example3.jpg'
            }
        ];

        $scope.store = {
            marketname: "강릉 중앙시장",
            name: "홍콩반점",
            favoritcount: "3",
            category: "짜장면",
            phone: "010-6521-6240",
            address: "강원도 강릉시 짜장면",
            bodytext: "이 짜장면 집으로 말씀드릴것 같으면 소림사에서 30년간 연마한 무술과 내공으로 최고의 면빨을 자랑하기 블라블라.",
            lat: "37.5069106",
            long: "127.0658082"
        };

        $scope.favoriteClick = function () {
            alert('Add to Favorite');
        };

        $scope.callClick = function () {
            window.open('tel:' + $scope.store.phone);
        };

        $scope.initialize = function () {
            var myLatlng = new google.maps.LatLng($scope.store.lat, $scope.store.long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                draggable: false,
                zoomControl: false,
                streetViewControl: false,
                disableDoubleClickZoom: false,
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
        google.maps.event.addDomListener(window, 'load', $scope.initialize);

    }]);
