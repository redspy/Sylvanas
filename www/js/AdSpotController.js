angular.module('starter.controllers')

.controller('adSpotController', ['$scope',
        '$ionicModal',
        '$timeout',
        '$cordovaCamera',
        '$cordovaFile',
        '$cordovaGeolocation',
        '$state',
        '$ionicScrollDelegate',
        'lightningDealService',
        'IMAGE_ENDPOINT',
        'imageService',
        '$q',
        '$cordovaSocialSharing',
        '$ionicPlatform',
        '$window',
        function ($scope, $ionicModal, $timeout, $cordovaCamera, $cordovaFile, $cordovaGeolocation, $state, $ionicScrollDelegate, lightningDealService, IMAGE_ENDPOINT, imageService, $q, $cordovaSocialSharing, $ionicPlatform, $window) {
        $scope.name = "반짝 떨이";
        $scope.imageURLs = [];

        $scope.$watch('items', function () {
            $timeout(function () {
                $ionicScrollDelegate._instances.forEach(function (delegateInstance) {
                    // delegateHandle이 horizontal로 시작하는 ion-scroll만 아래와 같이 이벤트 변경
                    if (/^horizontal[0-9]+/g.test(delegateInstance.$$delegateHandle)) {
                        var sv = delegateInstance.getScrollView();

                        var container = sv.__container;

                        var originaltouchStart = sv.touchStart;
                        var originalmouseDown = sv.mouseDown;
                        var originaltouchMove = sv.touchMove;
                        var originalmouseMove = sv.mouseMove;

                        container.removeEventListener('touchstart', sv.touchStart);
                        container.removeEventListener('mousedown', sv.mouseDown);
                        document.removeEventListener('touchmove', sv.touchMove);
                        document.removeEventListener('mousemove', sv.mouseMove);


                        sv.touchStart = function (e) {
                            e.preventDefault = function () {};
                            originaltouchStart.apply(sv, [e]);
                        };

                        sv.touchMove = function (e) {
                            e.preventDefault = function () {};
                            originaltouchMove.apply(sv, [e]);
                        };

                        sv.mouseDown = function (e) {
                            e.preventDefault = function () {};
                            originalmouseDown.apply(sv, [e]);
                        };

                        sv.mouseMove = function (e) {
                            e.preventDefault = function () {};
                            originalmouseMove.apply(sv, [e]);
                        };

                        container.addEventListener("touchstart", sv.touchStart, false);
                        container.addEventListener("mousedown", sv.mouseDown, false);
                        document.addEventListener("touchmove", sv.touchMove, false);
                        document.addEventListener("mousemove", sv.mouseMove, false);
                    }

                });
            });
        });

        function refreshItems() {
            lightningDealService.readAll({
                id: -1,
                count: -1
            }, function (data) {
                data.forEach(function (item) {
                    var now = new Date();
                    var end = new Date(item.EndDate);

                    item.EndDate = end.getTime() - now.getTimezoneOffset() * 60 * 1000;
                    item.Duration = Math.max((end.getTime() - (now.getTime() + now.getTimezoneOffset() * 60 * 1000)) / 1000, 0);
                    console.log(item.Duration);
                });
                $scope.items = data;
            });
        }

        refreshItems();

        $scope.timerDone = function (item) {
            if (item.Duration > 0) {
                item.Duration = 0;
                console.log(item.Duration);
                $scope.$apply();
            }
        };

        $scope.getImageURL = function (imageID) {
            return IMAGE_ENDPOINT + 'thumb/' + imageID;
        };

        // Pull to Refresh 로 당겼다가 놨을때 Callback
        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                // Refresh
                //$window.location.reload(true);
                //Stop the ion-refresher from spinning

                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
            refreshItems();
        };

        //글쓰기///////////////////////////////////////////////////////////////////////
        // 글쓰기에서 입력되는 Data 저장 : inputData
        $scope.inputData = [];

        // 글쓰기에서 입력되는 Data의 초기화
        $scope.refreshInputdata = function () {
            $scope.inputData = {
                title: '',
                nickName: window.localStorage['nickName'] || '',
                enddate: new Date(),
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
                        EndDate: $scope.inputData.enddate,
                        Images: imageKeys
                    };

                    lightningDealService.create(introData, function () {
                        $scope.closeWrite();
                        refreshItems();
                    });

                    $scope.imageURLs.length = 0;
                    $scope.inputData = {};
                });
            }, 1000);
        };
        //글쓰기///////////////////////////////////////////////////////////////////////


        ////////////////////////////////////////////////////////////////////////////////Image modal
        $ionicModal.fromTemplateUrl('templates/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imagemodal = modal;
        });

        $scope.openModal = function () {
            $scope.imagemodal.show();
        };

        $scope.closeModal = function () {
            $scope.imagemodal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.imagemodal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        $scope.$on('modal.shown', function () {
            console.log('Modal is shown!');
        });

        var selectedImageIndex = 0;

        $scope.showImage = function (index) {
            $scope.imageSrc = $scope.urlForImage($scope.thumbimages[index]); //'http://ionicframework.com/img/ionic-logo-blog.png';
            selectedImageIndex = index;
            $scope.openModal();
        };

        $scope.deleteImage = function () {
            $scope.thumbimages.splice(selectedImageIndex, 1);
        };
        ////////////////////////////////////////////////////////////////////////////////
        $scope.thumbimages = [];

        $scope.addImage = function () {
            // 2
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions
            };

            // 3
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $window.FilePath.resolveNativePath(imageData, function (data) {
                    console.log('resolveNativePath', data);
                    $window.resolveLocalFileSystemURL('file://' + data,
                        function (fileEntry) {
                            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                            var newName = makeid() + name;

                            $window.resolveLocalFileSystemURL(
                                cordova.file.dataDirectory,
                                function (fileSystem2) {
                                    fileEntry.copyTo(
                                        fileSystem2,
                                        newName,
                                        function (entry) {
                                            $scope.$apply(function () {
                                                console.log(entry);
                                                $scope.thumbimages.push(entry.nativeURL);
                                            });
                                        },
                                        function (error) {
                                            console.log(error);
                                        }
                                    );
                                },
                                function (error) {
                                    console.log(error);
                                });
                        },
                        function (error) {
                            console.log(error);
                        });
                }, function (error) {
                    console.log(error);
                });

                $scope.imageURLs.push(imageData);

                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }
            }, function (err) {
                console.log(err);
            });
        };

        $scope.urlForImage = function (imageName) {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            return trueOrigin;
        };

        $scope.updateEditor = function () {
            var element = document.getElementById("input_textarea");
            element.style.height = element.scrollHeight + "px";
        };

        $scope.onShare = function (id, title) {
            var target = document.getElementById(id);
            var clone = target.cloneNode(true);

            var style = clone.style;
            style.position = 'relative';
            style.overflow = 'visible';
            style.left = 0;
            style.top = 0;
            style.width = 'auto';
            style.height = 'auto';
            style.maxHeight = 'auto';

            document.body.appendChild(clone);
            html2canvas(clone, {
                logging: true,
                useCORS: true,
                taintTest: false
            }).then(function (canvas) {
                document.body.removeChild(clone);
                console.log(canvas.toDataURL());

                $ionicPlatform.ready(function () {
                    $cordovaSocialSharing
                        .share(title, title, canvas.toDataURL(), null);
                });
            });
        };
        }]);
