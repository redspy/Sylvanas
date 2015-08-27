angular.module('starter.controllers')

    .controller('favoritesController', ['$scope', 'bookmarkService', 'bookmarkStoreService', 'bookmarkSaleService', 'IMAGE_ENDPOINT', '$timeout', function ($scope, bookmarkService, bookmarkStoreService, bookmarkSaleService, IMAGE_ENDPOINT, $timeout) {
        $scope.name = "내 찜 목록";
        $scope.detailLinkLocalInformation = "#/app/localinformation/";
        $scope.detailLinkSaleEvent = "#/app/saleevent/";
        $scope.items = [
            {
                Id : "1",
                listType: "할인&이벤트",
                Title: "이것은 제목이지롱",
                body : "내용은 이러이러 합니다만,,",
                image: "/img/images.jpg"
            }
        ];
        $scope.doRefresh = function () {
            $timeout(function () {
                refresh();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        function refresh() {
            bookmarkService.readAll(function (data) {
                $scope.items = data;
            });
        }

        refresh();

        $scope.getImageURL = function (imageID) {
            return IMAGE_ENDPOINT + imageID;
        };
        //function alertDismissed() {
        //    // do something
        //}
        //
        //$scope.notification = function () {
        //    navigator.notification.beep();
        //    navigator.notification.vibrate(2000);
        //    navigator.notification.alert(
        //        'You are the winner!',  // message
        //        alertDismissed,         // callback
        //        'Game Over',            // title
        //        'Done'                  // buttonName
        //    );
        //};
    }]);
