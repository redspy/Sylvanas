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
.config(function () {
    /**
     * tokenHandler
     *
     * @param result
     *
     * 디바이스 토큰핸들러 콜백함수.
     * 푸시 서비스를 활성화 하였을 때, window.plugins.pushNotification.register 메소드가 실행되면서 디바이스 토큰을 가져와서 출력한다.
     * 만약에 푸시 서버로 디바이스 토큰을 보내야할 경우 이 함수 안에서 서버로 디바이스 토큰을 전송하면 된다.
     */
    function tokenHandler(result) {
        console.log('deviceToken:' + result);
    }

    /**
     * errorHandler
     *
     * @param err
     *
     * 에러 핸들러 콜백 함수.
     */
    function errorHandler(err) {
        console.log('error:' + err);
    }

    /**
     * successHandler
     *
     * @param result
     *
     * 디바이스로 푸시 메세지를 받았을 때 뱃지처리 이후 호출하는 콜백함수
     */
    function successHandler(result) {
        console.log('result:' + result);
    }

    /**
     * onNotificationAPN
     *
     * @param event
     *
     * iOS 디바이스로 푸시 메세지를 받을 때 호출되는 콜백함수, window.plugins.pushNotification.register 옵션 설정에서 ecb의 이름에 매칭된다.
     */
    window.onNotificationAPN = function (event) {
        // 푸시 메세지에 alert 값이 있을 경우
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }

        // 푸시 메세지에 sound 값이 있을 경우
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }

        // 푸시 메세지에 bage 값이 있을 경우
        if (event.badge) {
            window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        }
    };

    /**
     * onNotificationGCM
     *
     * @param e
     *
     * 안드로이드 디바이스로 푸시 메세지를 받을 때 호출되는 함수, window.plugins.pushNotification.register 옵션에 설정에서 ecb의 이름에 매칭된다.
     */
    window.onNotificationGCM = function (e) {
        switch (e.event) {
            case 'registered': // 안드로이드 디바이스의 registerID를 획득하는 event 중 registerd 일 경우 호출된다.
                console.log('registerID:' + e.regid);
                alert('registerID:' + e.regid);
                break;
            case 'message': // 안드로이드 디바이스에 푸시 메세지가 오면 호출된다.
                {
                    if (e.foreground) { // 푸시 메세지가 왔을 때 앱이 실행되고 있을 경우
                        var soundfile = e.soundname || e.payload.sound;
                        var my_media = new Media("/android_asset/www/" + soundfile);
                        my_media.play();
                    } else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 실행되거나 실행되지 않을 경우
                        if (e.coldstart) { // 푸시 메세지가 왔을 때 푸시를 선택하여 앱이 열렸을 경우
                            console.log("알림 왔을 때 앱이 열리고 난 다음에 실행 될때");
                        } else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 사용되고 있을 경우
                            console.log("앱이 백그라운드로 실행될 때");
                        }
                    }

                    console.log(e.payload.title);

                    navigator.notification.alert(e.payload.title);
                }
                break;
            case 'error': // 푸시 메세지 처리에 에러가 발생하면 호출한다.
                console.log('error:' + e.msg);
                break;
            case 'default':
                console.log('알수 없는 이벤트');
                break;
        }
    };

    // 디바이스가 ready가 될때 실행될 수 있도록 이벤트 리스너에 등록한다.
    document.addEventListener("deviceready", function () {
        /*
        if (device.platform.toUpperCase() == 'ANDROID') {
            window.plugins.pushNotification.register(successHandler, errorHandler, {
                "senderID": "196142849250", // Google GCM 서비스에서 생성한 Project Number를 입력한다.
                "ecb": "window.onNotificationGCM" // 디바이스로 푸시가 오면 onNotificationGCM 함수를 실행할 수 있도록 ecb(event callback)에 등록한다.
            });
        } else {
            // PushPlugin을 설치했다면 window.plugins.pushNotification.register를 이용해서 iOS 푸시 서비스를 등록한다.
            window.plugins.pushNotification.register(tokenHandler, errorHandler, {
                "badge": "true", // 뱃지 기능을 사용한다.
                "sound": "true", // 사운드를 사용한다.
                "alert": "true", // alert를 사용한다.
                "ecb": "window.onNotificationAPN" // 디바이스로 푸시가 오면 onNotificationAPN 함수를 실행할 수 있도록 ecb(event callback)에 등록한다.
            });
        }*/

    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html"
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
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/localinformation');
});
