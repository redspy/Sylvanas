// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ng-mfb', 'ngCordova'])

.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($ionicConfigProvider) {
        //if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);
    })


/**
 * Message 관련 Initialize 함수
 **/
.config(function (pushServiceProvider) {
    var option = {};
    if (ionic.Platform.platform().toUpperCase() === 'ANDROID') {
        option = {
            "senderID": "94366515322" // Google GCM 서비스에서 생성한 Project Number를 입력한다.
        };
    } else {
        option = {
            "badge": "true", // 뱃지 기능을 사용한다.
            "sound": "true", // 사운드를 사용한다.
            "alert": "true"  // alert를 사용한다.
        };
    }

    pushServiceProvider.setup(option, function (event) {
        console.log(event);
    }, function (success) {
    }, function (error) {
    }, function (token) {
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        resolve: {
            login: function ($q, authenticationService, certService, $cordovaDevice, $http, authService, pushService) {
                var deferred = $q.defer();
                pushService.getToken().then(function (token) {
                    certService.then(function (response) {
                        var publicKey = response.data;
                        var now = new Date();
                        var time = now.getTime();

                        var loginData = '';
                        
                        console.log(token);

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
                            console.log('login success');
                            deferred.resolve();
                        }, function (error) {
                            delete $http.defaults.headers.common['X-Token'];
                            console.log('login failed', error);
                            deferred.reject();
                        });
                    });
                });
                return deferred.promise;
            }
        }
    })

    .state('app.localinformation', {
            url: "/localinformation",
            views: {
                'menuContent': {
                    templateUrl: "templates/LocalInformation.html",
                    controller: 'localInformationController'
                }
            }
        })
        //adstore
        .state('app.adstore', {
            url: "/adstore",
            views: {
                'menuContent': {
                    templateUrl: "templates/AdStore.html",
                    controller: 'adStoreController'
                }
            }
        })

    //saleevent
    .state('app.saleevent', {
        url: "/saleevent",
        views: {
            'menuContent': {
                templateUrl: "templates/SaleEvent.html",
                controller: 'saleEventController'
            }
        }
    })

    //adspot
    .state('app.adspot', {
        url: "/adspot",
        views: {
            'menuContent': {
                templateUrl: "templates/AdSpot.html",
                controller: 'adSpotController'
            }
        }
    })

    //banner
    .state('app.banner', {
        url: "/banner",
        views: {
            'menuContent': {
                templateUrl: "templates/Banner.html",
                controller: 'bannerController'
            }
        }
    })

    //favorites
    .state('app.favorites', {
        url: "/favorites",
        views: {
            'menuContent': {
                templateUrl: "templates/Favorites.html",
                controller: 'favoritesController'
            }
        }
    })

    // LocalInformationDetail
    .state('app.localinformationdetail', {
        url: '/localinformation/:unitid',
        views: {
            'menuContent': {
                templateUrl: 'templates/LocalInformationDetail.html',
                controller: 'localinformationdetailcontroller'
            }
        }
    })

    // AdStoreDetail
    .state('app.adstoredetail', {
        url: '/adstore/:unitid',
        views: {
            'menuContent': {
                templateUrl: 'templates/_AdStoreDetail.html',
                controller: 'adstoredetailcontroller'
            }
        }
    })

    // AdSpotDetail
    .state('app.adspotdetail', {
        url: '/adspot/:unitid',
        views: {
            'menuContent': {
                templateUrl: 'templates/AdSpotDetail.html',
                controller: 'adspotdetailcontroller'
            }
        }
    })

    // SaleEventDetail
    .state('app.saleeventdetail', {
            url: '/saleevent/:unitid',
            views: {
                'menuContent': {
                    templateUrl: 'templates/SaleEventDetail.html',
                    controller: 'saleeventdetailcontroller'
                }
            }
        })
        // settingController
        .state('app.setting', {
            url: '/setting',
            views: {
                'menuContent': {
                    templateUrl: "templates/Setting.html",
                    controller: 'settingController'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/localinformation');
});