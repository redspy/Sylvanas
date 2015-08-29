angular.module('starter.controllers').directive('authentication', ['authenticationService', 'authService', '$ionicPlatform', '$http', 'certService', function (authenticationService, authService, $ionicPlatform, $http, certService) {
    var failed = 0;
    return {
        restrict: 'C',
        link: function (scope) {
            scope.$on('event:auth-loginRequired', function () {
                console.log('login require');
                failed++;

                certService.then(function (response) {
                    var publicKey = response.data;
                    var now = new Date();
                    var time = now.getTime();
                    var loginData = angular.fromJson({
                        'Now': parseInt(time / 1000),
                        'DeviceUUID': 'TEST_DEVICE_UUID',
                        'DeviceToken': 'TEST_DEVICE_TOKEN',
                        'DeviceOS': 'TEST_DEVICE_OS'
                    });
                    console.log(JSON.stringify(loginData));

                    var encrypt = new JSEncrypt();
                    encrypt.setPublicKey(publicKey);
                    var encrypted = encrypt.encrypt(JSON.stringify(loginData));

                    authenticationService.login({
                        'Login': encrypted
                    }, function (response) {
                        $http.defaults.headers.common['X-Device-Id'] = 'TEST_DEVICE_UUID';
                        if (failed < 2)
                            authService.loginConfirmed();
                    }, function (error) {
                        console.log('login failed', error);
                    });
                });
            });
            scope.$on('event:auth-loginConfirmed', function () {
                console.log('login sucess');
            });
        }
    };
}]);
