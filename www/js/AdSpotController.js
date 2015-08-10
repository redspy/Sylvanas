angular.module('starter.controllers')

    .controller('adSpotController', ['$scope',
        '$ionicModal',
        '$timeout',
        '$cordovaCamera',
        '$cordovaFile',
        '$cordovaGeolocation',
        '$state',
        '$ionicScrollDelegate',
        '$timeout',
        function ($scope, $ionicModal, $timeout, $cordovaCamera, $cordovaFile, $cordovaGeolocation, $state, $ionicScrollDelegate, $timeout) {
        $scope.name = "반짝 떨이";

        $scope.handle = $ionicScrollDelegate.$getByHandle('mainScroll');

        $scope.onDrag = function (e) {
            var distance = -1 * e.gesture.deltaY;
            $scope.handle.scrollBy(0, distance, true);
        };

        $scope.rndIndex = function() {
            var rndIndex = Math.floor((Math.random() * 10000));
            if (rndIndex < 2000) {
                return null;
            }
            else {
                return rndIndex;
            }
        }

        $scope.items = [
            {
                id: '0001',
                title: '탄산수를 집에서 직접 만들어 먹자!!',
                nickname: '넌이미사고있다',
                uploaddate: '2015. 7. 1',
                body: '지금까지 사먹던 바로 그것! 탄산수!! 이제는 집에서 만들어 드실 수 있습니다. 한번 먹어봐~! 장님이 벌떡 일어나고 앉음뱅이가 눈을 번쩍! 이제는 사먹지 마세요',
                images: [
                    {
                        url: 'example1.jpg'
                    },
                    {
                        url: 'example2.jpg'
                    },
                    {
                        url: 'example3.jpg'
                    }
                ],
                enddate: $scope.rndIndex()
            },
            {
                id: '0002',
                title: '무료로 앱 만들어 드립니다.',
                uploaddate: '2015. 6. 30',
                nickname: '일단보고가',
                body: '핸드폰 앱 만들기! 별거 아닙니다.. 그까이꺼 그냥 대~~충 만들다 보면 대박이 나고, 대박이 나면 잘살아 지고, 잘살아 지면 죽어.',
                url: '',
                images: [
                    {
                        url: 'images-1.jpg'
                    },
                    {
                        url: 'images-2.jpg'
                    },
                    {
                        url: 'images-3.jpg'
                    }
                ],
                enddate: $scope.rndIndex()
            },
            {
                id: '0001',
                title: '탄산수를 집에서 직접 만들어 먹자!!',
                nickname: '넌이미사고있다',
                uploaddate: '2015. 7. 1',
                body: '지금까지 사먹던 바로 그것! 탄산수!! 이제는 집에서 만들어 드실 수 있습니다. 한번 먹어봐~! 장님이 벌떡 일어나고 앉음뱅이가 눈을 번쩍! 이제는 사먹지 마세요',
                images: [
                    {
                        url: 'example1.jpg'
                    },
                    {
                        url: 'example2.jpg'
                    },
                    {
                        url: 'example3.jpg'
                    }
                ],
                enddate: $scope.rndIndex()
            },
            {
                id: '0002',
                title: '무료로 앱 만들어 드립니다.',
                uploaddate: '2015. 6. 30',
                nickname: '일단보고가',
                body: '핸드폰 앱 만들기! 별거 아닙니다.. 그까이꺼 그냥 대~~충 만들다 보면 대박이 나고, 대박이 나면 잘살아 지고, 잘살아 지면 죽어.',
                url: '',
                images: [
                    {
                        url: 'images-1.jpg'
                    },
                    {
                        url: 'images-2.jpg'
                    },
                    {
                        url: 'images-3.jpg'
                    }
                ],
                enddate: $scope.rndIndex()
            },
            {
                id: '0001',
                title: '탄산수를 집에서 직접 만들어 먹자!!',
                nickname: '넌이미사고있다',
                uploaddate: '2015. 7. 1',
                body: '지금까지 사먹던 바로 그것! 탄산수!! 이제는 집에서 만들어 드실 수 있습니다. 한번 먹어봐~! 장님이 벌떡 일어나고 앉음뱅이가 눈을 번쩍! 이제는 사먹지 마세요',
                images: [
                    {
                        url: 'example1.jpg'
                    },
                    {
                        url: 'example2.jpg'
                    },
                    {
                        url: 'example3.jpg'
                    }
                ],
                enddate: $scope.rndIndex()
            },
            {
                id: '0002',
                title: '무료로 앱 만들어 드립니다.',
                uploaddate: '2015. 6. 30',
                nickname: '일단보고가',
                body: '핸드폰 앱 만들기! 별거 아닙니다.. 그까이꺼 그냥 대~~충 만들다 보면 대박이 나고, 대박이 나면 잘살아 지고, 잘살아 지면 죽어.',
                url: '',
                images: [
                    {
                        url: 'images-1.jpg'
                    },
                    {
                        url: 'images-2.jpg'
                    },
                    {
                        url: 'images-3.jpg'
                    }
                ],
                enddate: $scope.rndIndex()
            },
        ];
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
            $scope.images = [];
            window.localStorage['nickName'] = $scope.inputData.nickName;
            $scope.inputData = [];
            $timeout(function () {
                $scope.closeWrite();
            }, 1000);
        };
        //글쓰기///////////////////////////////////////////////////////////////////////

        // Pull to Refresh 로 당겼다가 놨을때 Callback
        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                // Refresh
                //$window.location.reload(true);
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

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
            $scope.imageSrc = $scope.urlForImage($scope.images[index]);//'http://ionicframework.com/img/ionic-logo-blog.png';
            selectedImageIndex = index;
            $scope.openModal();
        };

        $scope.deleteImage = function () {
            $scope.images.splice(selectedImageIndex, 1);
        };
        ////////////////////////////////////////////////////////////////////////////////
        $scope.images = [];

        $scope.addImage = function () {
            // 2
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,// Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions
            };

            // 3
            $cordovaCamera.getPicture(options).then(function (imageData) {

                // 4
                onImageSuccess(imageData);

                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                // 6
                function onCopySuccess(entry) {
                    $scope.$apply(function () {
                        $scope.images.push(entry.nativeURL);
                    });
                }

                function fail(error) {
                    console.log("fail: " + error.code);
                }

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
    }]);
