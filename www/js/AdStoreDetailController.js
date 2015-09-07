angular.module('starter.controllers')

    .controller('adstoredetailcontroller', ['$scope', '$stateParams', 'introShopService', '$q', 'IMAGE_ENDPOINT', '$ionicSlideBoxDelegate', 'introShopReplyService', function ($scope, $stateParams, introShopService, $q, IMAGE_ENDPOINT, $ionicSlideBoxDelegate, introShopReplyService) {
        $scope.name = "내가게 알리기";
        $scope.id = $stateParams.unitid;
        $scope.item = [];
        $scope.images = [];

        function getStoreInformation(from, count) {
            var deferred = $q.defer();

            introShopService.readAll(
                {id:from, count:count},
                function (value, responseHeaders) {
                    deferred.resolve(value);
                }, function (httpResponse) {
                    deferred.reject(httpResponse)
                });

            return deferred.promise;
        }

        $scope.refreshItems = function() {
            getStoreInformation($scope.id, 1).then(function (data) {
                console.log(data);
                $scope.images = [];
                $scope.item = data[0];
                $scope.name = $scope.item.Name;
                for (var i = 0; i < $scope.item.Images.length; i++) {
                    $scope.images.push($scope.getImageURL($scope.item.Images[i]));
                }
            });
        }

        $scope.refreshItems();

        $scope.getImageURL = function (imageID) {
            return IMAGE_ENDPOINT + imageID;
        };

        $scope.doSomething = function () {
            $scope.submitReply($scope.id);
            $scope.reply = "";
        };

        $scope.submitReply = function (id) {
            /*
             if ('Id' in $scope.reply) {
             lightningDealService.modify({
             id: $scope.reply.Id
             }, $scope.reply, function () {
             $scope.refreshItems();
             });
             } else
             */
            var replyJSON = {
                NickName : 'O',
                Description : $scope.reply
            };
            {
                introShopReplyService.create({
                    id: id
                }, replyJSON, function () {
                    $scope.item = [];
                    $scope.refreshItems();
                });
            }

        };
        $scope.favoriteClick = function () {
            alert('Add to Favorite');
        };

        $scope.callClick = function () {
            window.open('tel:' + $scope.item.Contact);
        };

        function refreshIntroShop() {
            introShopService.readAll({
                id: -1, count: -1
            }, function (data) {
                $scope.introShops = data;
            });
        }

        refreshIntroShop();


    }]);
