angular.module('starter.controllers')

.controller('saleEventController', function ($scope) {
    $scope.name = "할인 & 이벤트";

    $scope.images = [
        {
            url :'images-1.jpg'
        },
        {
            url :'images-2.jpg'
        },
        {
            url :'images-3.jpg'
        },
        {
            url :'images-4.jpg'
        },
        {
            url :'images-5.jpg'
        },
        {
            url :'images.jpg'
        }
    ]
});
