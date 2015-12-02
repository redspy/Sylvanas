angular.module('starter.controllers')

    .controller('adspotdetailcontroller', ['$scope', '$stateParams', 'lightningDealService', '$q', 'IMAGE_ENDPOINT', '$timeout', 'lightningDealReplyService', '$ionicActionSheet', 'login', function ($scope, $stateParams, lightningDealService, $q, IMAGE_ENDPOINT, $timeout, lightningDealReplyService, $ionicActionSheet, login) {
        $scope.name = "반짝 떨이";
        $scope.id = $stateParams.unitid;
        $scope.item = [];
        $scope.images = [];
        $scope.showMenu = false;

        var userID = login.context.user;

        function getStoreInformation(from, count) {
            var deferred = $q.defer();

            lightningDealService.readAll(
                {id:from, count:count},
                function (value, responseHeaders) {
                    deferred.resolve(value);
                }, function (httpResponse) {
                    deferred.reject(httpResponse)
                });

            return deferred.promise;
        }

        $scope.refreshItems = function(){
            getStoreInformation($scope.id, 1).then(function (data) {
                console.log(data);
                $scope.images = [];
                $scope.item = data[0];
                //$scope.name = $scope.item.Name;
                for (var i = 0; i < $scope.item.Images.length; i++) {
                    $scope.images.push($scope.getImageURL($scope.item.Images[i]));
                }
                var now = new Date();
                var end = new Date($scope.item.EndDate);

                $scope.item.EndDate = end.getTime() - now.getTimezoneOffset() * 60 * 1000;
                $scope.item.Duration = Math.max((end.getTime() - (now.getTime() + now.getTimezoneOffset() * 60 * 1000)) / 1000, 0);

                // $scope.item.Description = $scope.item.Description.replace(/\n/g, '<br/>');
                // document.getElementById("description").innerHTML.replace(/\n/g, '<br/>');
                if (userID == $scope.item.UserId) {
                    $scope.showMenu = true;
                }
                else {
                    $scope.showMenu = false;
                }
            });
        }

        $scope.refreshItems();

        $scope.getImageURL = function (imageID) {
            return IMAGE_ENDPOINT + imageID;
        };

        $scope.doSomething = function () {
            $scope.submitReply($scope.id);
            $scope.reply = '';
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
            }
            {
                lightningDealReplyService.create({
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
        $scope.showActionSheet = function () {
            $ionicActionSheet.show({
                titleText: '생생시장정보',
                buttons: [
                    {
                        text: '<i class="icon ion-android-create"></i><b>글 수정</b>'
                    },
                    {
                        text: '<i class="icon ion-close-circled"></i><b>글 삭제</b>'
                    },
                ],
                //destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                    },
                buttonClicked: function (index) {
                        console.log('BUTTON CLICKED', index);
                        return true;
                    },
                destructiveButtonClicked: function () {
                    console.log('DESTRUCT');
                    return true;
                }
            });
        }
    }]);
