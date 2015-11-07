angular.module('starter.controllers').directive('authentication', ['loginService', 'authService', function (loginService, authService) {
    return {
        restrict: 'C',
        link: function (scope) {
            scope.$on('event:auth-loginRequired', function () {
                console.log('login require');

                loginService.login().then(function (token) {
                    authService.loginConfirmed(null, function (config) {
                        config.headers['X-Token'] = token;
                        return config;
                    });
                });
            });
        }
    };
}]);