angular.module('starter.controllers')

    .directive('blockMenuContent', function ($compile, $timeout, $ionicSideMenuDelegate) {
        return {
            restrict: 'A',
            controller: function ($scope) {
                $scope.blockShow= false;
                $scope.blockStyle = {
                    'background-color':'#000',
                    'width':'100%',
                    'height':'100%',
                    'position':'absolute',
                    'z-index':'100',
                    'opacity': 0
                };
            },
            compile: function (element) {
                console.log(1);
                var div = angular.element('<div ng-show="blockShow" ng-style="blockStyle"></div>');
                element.prepend(div);

                return function ($scope) {
                    $timeout(function () {
                        $scope.$watch(function () {
                            return $ionicSideMenuDelegate.getOpenRatio();
                        }, function (newValue) {
                            if (newValue === 0) {
                                $scope.blockShow = false;
                                $scope.blockStyle.opacity = 0;
                            } else {
                                $scope.blockShow = true;
                                $scope.blockStyle.opacity = 0.5 * newValue;
                            }
                        });
                    });
                };
            }
        };
    });