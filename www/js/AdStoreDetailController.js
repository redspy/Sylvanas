angular.module('starter.controllers')

    .controller('adstoredetailcontroller', ['$scope', '$stateParams', 'introShopService', '$q', 'IMAGE_ENDPOINT', '$ionicSlideBoxDelegate', 'introShopReplyService', '$ionicActionSheet', '$ionicModal', function ($scope, $stateParams, introShopService, $q, IMAGE_ENDPOINT, $ionicSlideBoxDelegate, introShopReplyService, $ionicActionSheet, $ionicModal) {
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
                //$scope.name = $scope.item.Name;
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
                        if (index == 0) {
                            $scope.write();
                        }
                        console.log('BUTTON CLICKED', index);
                        return true;
                    },
                destructiveButtonClicked: function () {
                    console.log('DESTRUCT');
                    return true;
                }
            });
        }
        //글쓰기///////////////////////////////////////////////////////////////////////
            // 글쓰기에서 입력되는 Data 저장 : inputData
            $scope.inputData = [];

            // 글쓰기에서 입력되는 Data의 초기화
            $scope.refreshInputdata = function () {
                $scope.inputData = {
                    title: '',
                    nickName: window.localStorage['nickName'] || '',
                    body: ''
                };
            };
            // Create the write modal that we will use later
            $ionicModal.fromTemplateUrl('templates/AddAdStore.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the write modal to close it
            $scope.closeWrite = function () {
                $scope.modal.hide();
            };

            // 글쓰기 Data 초기화한뒤 Open the write modal
            $scope.write = function () {
                $scope.refreshInputdata();
                $scope.modal.show();
            };

            // 글쓰기 입력 후 글 올리기 버튼 눌렀을때
            $scope.doWrite = function () {
                $scope.thumbimages = [];
                window.localStorage['nickName'] = $scope.inputData.nickName;

                $timeout(function () {
                    var imageKeys = [];
                    var imagePromise = [];

                    $scope.imageURLs.forEach(function (url) {
                        imagePromise.push(imageService.create(url)
                            .then(function (res) {
                                imageKeys.push(res.value.image);
                            }));
                    });

                    $q.all(imagePromise).then(function () {
                        var introData = {
                            Title: $scope.inputData.title,
                            Description: $scope.inputData.body,
                            NickName: $scope.inputData.nickName,
                            Images: imageKeys
                        };

                        introShopService.create(introData, function () {
                            $scope.closeWrite();
                            refreshItems();
                        });

                        $scope.imageURLs.length = 0;
                        $scope.inputData = {};
                    });
                }, 1000);
            };
            //글쓰기///////////////////////////////////////////////////////////////////////

    }]);
