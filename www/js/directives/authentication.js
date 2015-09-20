angular.module('starter.controllers').directive('authentication', ['authenticationService', 'authService', '$ionicPlatform', '$http', 'certService', '$cordovaDevice', function (authenticationService, authService, $ionicPlatform, $http, certService, $cordovaDevice) {
    return {
        restrict: 'C',
        link: function (scope) {
            scope.$on('event:auth-loginRequired', function () {
                console.log('login require');

                certService.then(function (response) {
                    delete $http.defaults.headers.common['X-Token'];

                    var publicKey = response.data;
                    var now = new Date();
                    var time = now.getTime();

                    var loginData = '';
                    if (ionic.Platform.platform() == 'win32') {
                        loginData = angular.fromJson({
                            'Now': parseInt(time / 1000),
                            'DeviceUUID': 'WINDOW_DEBUG_DEVICE',
                            'DeviceToken': 'WINDOW_DEBUG_TOKEN',
                            'DeviceOS': ionic.Platform.platform()
                        });
                    } else {
                        loginData = angular.fromJson({
                            'Now': parseInt(time / 1000),
                            'DeviceUUID': $cordovaDevice.getUUID(),
                            'DeviceToken': 'TEST_DEVICE_TOKEN',
                            'DeviceOS': ionic.Platform.platform()
                        });
                    }

                    var encrypt = new JSEncrypt();
                    encrypt.setPublicKey(publicKey);
                    var encrypted = encrypt.encrypt(JSON.stringify(loginData));

                    authenticationService.login({
                        'Login': encrypted
                    }, function (response) {
                        $http.defaults.headers.common['X-Token'] = response.token;
                        authService.loginConfirmed(response.token, function (config) {
                            config.headers['X-Token'] = response.token;
                            return config;
                        });
                        authService.loginConfirmed();
                        console.log('login success');
                    }, function (error) {
                        delete $http.defaults.headers.common['X-Token'];
                        console.log('login failed', error);
                    });
                });
            });
        }
    };
}]);