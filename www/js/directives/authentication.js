angular.module('starter.controllers').directive('authentication', ['authenticationService', 'authService', '$ionicPlatform', '$http', function (authenticationService, authService, $ionicPlatform, $http) {
    var failed = 0;
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            scope.$on('event:auth-loginRequired', function () {
                console.log('login require');
                failed++;
                authenticationService.login({
                    'DeviceUUID': 'TEST_DEVICE_UUID',
                    'DeviceToken': 'TEST_DEVICE_TOKEN',
                    'DeviceOS': 'TEST_DEVICE_OS'
                }, function (response, headers) {
                    $http.defaults.headers.common['X-Device-Id'] = 'TEST_DEVICE_UUID';
                    if (failed < 2)
                        authService.loginConfirmed();
                }, function (error) {
                    console.log('login failed', error);

                });
            });
            scope.$on('event:auth-loginConfirmed', function () {
                console.log('login sucess');
            });
        }
    };
}]);
