angular.module('starter.controllers')

    .constant('SERVICE_ENDPOINT', 'http://222.122.143.163/undercity/api')
    .constant('IMAGE_ENDPOINT', 'http://222.122.143.163/undercity/api/images/')
    //.constant('SERVICE_ENDPOINT', 'http://192.168.1.2/undercity/api')
    //.constant('IMAGE_ENDPOINT', 'http://192.168.1.2/undercity/api/images/')
    .config(function($ionicConfigProvider) {
        $ionicConfigProvider.views.transition('ios');
        $ionicConfigProvider.tabs.style('standard').position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center').positionPrimaryButtons('left');
    });

