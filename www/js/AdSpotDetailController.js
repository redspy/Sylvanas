angular.module('starter.controllers')

.controller('adspotdetailcontroller', ['$scope', '$stateParams', 'lightningDealService', '$q', 'IMAGE_ENDPOINT', '$timeout', 'lightningDealReplyService', '$ionicActionSheet', '$ionicModal', 'login', '$ionicHistory', '$window', '$state', 'lightningDeals', function ($scope, $stateParams, lightningDealService, $q, IMAGE_ENDPOINT, $timeout, lightningDealReplyService, $ionicActionSheet, $ionicModal, login, $ionicHistory, $window, $state, lightningDeals) {
    $scope.name = "반짝 떨이";
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
        $scope.showMenu = userID == item.UserId;

        for (var i = 0; i < item.Replies.length; i++) {
            item.Replies[i].RelativeCreateDate = moment(item.Replies[i].CreateDate).fromNow();
        }

        $scope.item = item;
    }

    $scope.refreshItems = function () {
        lightningDeals.getItem($scope.id).then(transformItem);
    };

    $scope.refreshItems();

    $scope.getImageURL = function (imageID) {
        return IMAGE_ENDPOINT + imageID;
    };

    $scope.doSomething = function () {};

    $scope.submitReply = function () {
        var id = $scope.id;
        if (!$scope.reply && $scope.reply.length != 0) {
            $window.navigator.notification.confirm('댓글을 입력해주세요.', function () {}, '알림', ['확인']);
            return;
        }

        var replyJSON = {
            NickName: 'anonymous',
            Description: $scope.reply
        };

        lightningDealReplyService.create({
            id: id
        }, replyJSON, function () {
            $scope.reply = '';
            $scope.item = [];

            lightningDeals.refreshItem($scope.id).then(transformItem);
        });
    };

    $scope.showActionSheet = function () {
        var sheet = $ionicActionSheet.show({
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
                                lightningDeals.removeItem($scope.id).then(function () {
                                    $ionicHistory.clearCache();
                                    $ionicHistory.clearHistory();
                                    $state.go('app.adspot'); //});

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
                sheet();
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
            body: $scope.item.Description,
            enddate: new Date($scope.item.EndDate)
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
            var end = new Date($scope.inputData.enddate);
            end = new Date(end.getTime() - end.getTimezoneOffset() * 60 * 1000);

            var introData = {
                Title: $scope.inputData.title,
                Description: $scope.inputData.body,
                NickName: $scope.inputData.nickName,
                EndDate: end
            };

            lightningDeals.modifyItem($scope.id, introData).then(function (data) {
                transformItem(data);
                $scope.closeWrite();
            });
        }, 1000);
    };
}]);
