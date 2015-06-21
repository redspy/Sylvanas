// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ng-mfb'])

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
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/localinformation');
});