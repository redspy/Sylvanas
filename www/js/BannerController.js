angular.module('starter.controllers')

.controller('bannerController', ['$scope', function ($scope) {
    $scope.name = "배너광고";

    $scope.ads = [{ link : 'tel:123123123', banner : 'images-1.jpg', name : 'ionic' },
                  { link : 'tel:123123123', banner : 'images.jpg', name : 'ionic' },
                  { link : 'tel:123123123', banner : 'imgres-1.jpg', name : 'ionic' },
                  { link : 'tel:123123123', banner : 'images-2.jpg', name : 'ionic' },
                  { link : 'tel:123123123', banner : 'images-3.jpg', name : 'ionic' },
                  { link : 'tel:123123123', banner : 'images-4.jpg', name : 'ionic' },
                  { link : 'tel:123123123', banner : 'images-5.jpg', name : 'ionic' },
                  { link : 'tel:123123123', banner : 'imgres.jpg', name : 'ionic' }
                  ];

}]);
