angular.module('starter.controllers')

    .controller('bannerController', ['$scope', 'bannerService', 'IMAGE_ENDPOINT', 'imageService', function ($scope, bannerService, IMAGE_ENDPOINT, imageService) {
        $scope.name = "배너광고";
        $scope.ads = [];

        var imageId = -1;
        $scope.$watch('files', function () {
            if ($scope.files != undefined) {
                console.log($scope.files);
                imageService
                    .create($scope.files)
                    .success(function (data, status, headers, config) {
                        imageId = data.image;
                    });
            }

        });

        $scope.onClick = function () {
            var contact = $scope.Contact || '노영태 천재';
            var contactType = $scope.ContactType || 0;

            if (imageId != -1) {
                bannerService.create({
                    'Contact': contact,
                    'ContactType': contactType,
                    'ImageId': imageId
                }, function (response) {
                    console.log(response);
                })
            }
        }

        bannerService.readAll({}, function (data) {
            data.forEach( function (currentValue) {
               console.log(currentValue);
                var url = '';
                if (currentValue.ContactType == 1) {
                    url = 'tel:'
                }

                url += currentValue.Contact;
                img = IMAGE_ENDPOINT + currentValue.ImageId;

                $scope.ads.push({
                    'url': url,
                    'img': img
                });
            });
        });
    }]);
