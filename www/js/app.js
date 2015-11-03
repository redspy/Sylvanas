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
            /*
             if ((event.event === 'message')) {
             if (confirm(event.message) == true) {
             location.replace("#/app/saleevent/" + event.payload.data.Id);
             }
             }
             */
            if ((event.event === 'message')) {
                if (event.foreground) { // 푸시 메세지가 왔을 때 앱이 실행되고 있을 경우
                    //var soundfile = event.soundname || event.payload.sound;
                    //var my_media = new Media("/android_asset/www/" + soundfile);
                    //my_media.play();
                    navigator.notification.confirm(event.message,
                        function(buttonIndex)
                        {
                            if(buttonIndex == 2) {
                                location.replace("#/app/saleevent/" + event.payload.data.Id);
                            }
                        },
                        '이벤트알림',
                        ['닫기','이동']);
                } else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 실행되거나 실행되지 않을 경우
                    if (event.coldstart) { // 푸시 메세지가 왔을 때 푸시를 선택하여 앱이 열렸을 경우
                        console.log("알림 왔을 때 앱이 열리고 난 다음에 실행 될때");
                        location.replace("#/app/saleevent/" + event.payload.data.Id);
                    } else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 사용되고 있을 경우
                        console.log("앱이 백그라운드로 실행될 때");
                    }
                }
                console.log(event.payload.title);

            }
        }, function (success) {
        }, function (error) {
    }, function (token) {
    });
})

.config(function() {
    if (!(ionic.Platform.platform() == 'win32' || ionic.Platform.platform() == 'macintel'))
    {
        ionic.Platform.ready(function(){
            console.log('IONIC Device Ready and Register BackgroundGeoLocation!!!');

            var callbackFn = function(location) {
            console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
                var messageString = '[BackgroundGeoLocation] :  ' + location.latitude + ',' + location.longitude;
                window.plugins.toast.showWithOptions(
                    {
                        message: messageString,
                        duration: "short",
                        position: "bottom",
                        addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                    }
                );
            // Do your HTTP request here to POST location to your server.
            // jQuery.post(url, JSON.stringify(location));

            /*
            IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            */
            backgroundGeoLocation.finish();
        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error');
        };

        // BackgroundGeoLocation is highly configurable. See platform specific configuration options
        backgroundGeoLocation.configure(callbackFn, failureFn, {
            notificationTitle: '생생시장정보',
            notificationText: '알림 활성화상태',
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
            interval : 10000
        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        backgroundGeoLocation.start();

        // If you wish to turn OFF background-tracking, call the #stop method.
        // backgroundGeoLocation.stop();
        })
    }
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        resolve: {
            login: function (loginService) {
                return loginService;
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
