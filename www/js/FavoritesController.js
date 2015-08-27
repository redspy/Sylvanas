angular.module('starter.controllers')

    .controller('favoritesController', ['$scope', function ($scope) {
        $scope.name = "내 찜 목록";

        $scope.items = [
            {
                Id : "1",
                listType: "할인&이벤트",
                Title: "이것은 제목이지롱",
                body : "내용은 이러이러 합니다만,,",
                image: "/img/images.jpg"
            }
        ];

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
