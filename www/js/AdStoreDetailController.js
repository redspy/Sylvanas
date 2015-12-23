angular.module('starter.controllers')

.controller('adstoredetailcontroller', ['$scope', '$stateParams', 'introShopService', '$q', 'IMAGE_ENDPOINT', '$ionicSlideBoxDelegate', 'introShopReplyService', '$ionicActionSheet', '$ionicModal', 'login', '$timeout', '$ionicHistory', '$window', '$state', 'introShops', function ($scope, $stateParams, introShopService, $q, IMAGE_ENDPOINT, $ionicSlideBoxDelegate, introShopReplyService, $ionicActionSheet, $ionicModal, login, $timeout, $ionicHistory, $window, $state, introShops) {
    $scope.name = "내가게 알리기";
    $scope.id = $stateParams.unitid;
    $scope.item = [];
    $scope.images = [];
    $scope.showMenu = false;

    var userID = login.context.user;

    function transformItem(item) {
        $scope.images = [];

        for (var i = 0; i < item.Images.length; i++) {
            $scope.images.push($scope.getImageURL(item.Images[i]));
        }
        for (var i = 0; i < item.Replies.length; i++) {
            item.Replies[i].RelativeCreateDate = moment(item.Replies[i].CreateDate).fromNow();
        }
        $scope.showMenu = userID == item.UserId;
        $scope.item = item;
    }

    $scope.refreshItems = function () {
        introShops.getItem($scope.id).then(transformItem);
    };

    $scope.refreshItems();

    $scope.getImageURL = function (imageID) {
        return IMAGE_ENDPOINT + imageID;
    };

    $scope.doSomething = function () {
        $scope.submitReply($scope.id);
        $scope.reply = "";
    };

    $scope.submitReply = function (id) {
        if (($scope.reply === undefined) || ($scope.reply.length == 0)) {
            $window.navigator.notification.confirm('댓글을 입력해주세요.', function () {}, '알림', ['확인']);
            return;
        }

        var replyJSON = {
            NickName: 'O',
            Description: $scope.reply
        };

        introShopReplyService.create({
            id: id
        }, replyJSON, function () {
            $scope.reply = '';
            $scope.item = [];

            introShops.refreshItem($scope.id).then(transformItem);
        });
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
                    }
                ],
            //destructiveText: 'Delete',
            cancelText: 'Cancel',
            cancel: function () {
                console.log('CANCELLED');
            },
            buttonClicked: function (index) {
                if (index == 0) {
                    $scope.write();
                } else if (index == 1) {
                    $window.navigator.notification.confirm('삭제를 원하시면 확인버튼을 눌러 주세요',
                        function (buttonIndex) {
                            if (buttonIndex == 2) {
                                introShops.removeItem($scope.id).then(function () {
                                    $ionicHistory.clearCache();
                                    $ionicHistory.clearHistory();
                                    $state.go('app.adstore'); //});

                                    window.plugins.toast.showWithOptions({
                                        message: '삭제되었습니다',
                                        duration: "short",
                                        position: "bottom",
                                        addPixelsY: -40 // added a negative value to move it up a bit (default 0)
                                    });
                                });
                            }
                        },
                        '정말 삭제하시겠습니까?', ['취소', '확인']);
                }

                return true;
            },
            destructiveButtonClicked: function () {
                console.log('DESTRUCT');
                return true;
            }
        });
    };
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

    $scope.fillinputdata = function () {
        $scope.inputData = {
            title: $scope.item.Title,
            nickName: $scope.item.NickName, // window.localStorage['nickName'] || '',
            body: $scope.item.Description
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
        $scope.fillinputdata();
        $scope.modal.show();
    };

    // 글쓰기 입력 후 글 올리기 버튼 눌렀을때
    $scope.doWrite = function () {
        $scope.thumbimages = [];
        window.localStorage['nickName'] = $scope.inputData.nickName;

        $timeout(function () {

            var introData = {
                Id: $scope.id,
                Title: $scope.inputData.title,
                Description: $scope.inputData.body,
                NickName: $scope.inputData.nickName
                    //                    Images: imageKeys
            };

            introShops.modifyItem($scope.id, introData).then(function () {
                $scope.closeWrite();
            });

        }, 1000);
    };
    //글쓰기///////////////////////////////////////////////////////////////////////

    }]);
