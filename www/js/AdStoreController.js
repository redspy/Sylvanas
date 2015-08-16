angular.module('starter.controllers')

    .controller('adStoreController',
    ['$scope',
        '$ionicModal',
        '$timeout',
        '$cordovaCamera',
        '$cordovaFile',
        '$cordovaGeolocation',
        '$state',
        '$ionicScrollDelegate',
        '$q',
        'introShopService',
        'IMAGE_ENDPOINT',
        'SERVICE_ENDPOINT',
        '$cordovaFileTransfer',
        'imageService',
        function ($scope, $ionicModal, $timeout, $cordovaCamera, $cordovaFile, $cordovaGeolocation, $state, $ionicScrollDelegate, $q, introShopService, IMAGE_ENDPOINT, SERVICE_ENDPOINT, $cordovaFileTransfer, imageService) {
            $scope.name = "내가게 알리기";

            $scope.handle = $ionicScrollDelegate.$getByHandle('mainScroll');

            $scope.onDrag = function (e) {
                var distance = -1 * e.gesture.deltaY;
                $scope.handle.scrollBy(0, distance, true);
            };

            /* spencer.roh
             * 서버에서 데이터를 가져온다. 제일 최근에서 부터 10개 데이터를 가져오도록 함.
             */
            function refreshItems() {
                introShopService.readAll({
                    id: -1, count: 10
                }, function (data) {
                    $scope.items = data;
                })
            }
            $scope.getImageURL = function (imageID) {
                return IMAGE_ENDPOINT + imageID;
            };

            refreshItems();
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

            // Pull to Refresh 로 당겼다가 놨을때 Callback
            $scope.doRefresh = function () {
                $timeout(function () {
                    /* spencer.roh
                     * pull to refresh가 이뤄지면 서버에서 결과값을 다시 받아오도록함
                     */
                    refreshItems();
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
            $scope.imageURLs = [];

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
                        //createFileEntry(fileURI);
                        $scope.imageURLs.push(fileURI);
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

            /* 현재위치로 맵 띄우기 예제

             var posOptions = {timeout: 10000, enableHighAccuracy: false};
             $cordovaGeolocation
             .getCurrentPosition(posOptions)
             .then(function (position) {
             $scope.lat  = position.coords.latitude
             $scope.long = position.coords.longitude
             initialize();
             }, function(err) {
             // error
             });


             var watchOptions = {
             frequency : 1000,
             timeout : 3000,
             enableHighAccuracy: false // may cause errors if true
             };

             var watch = $cordovaGeolocation.watchPosition(watchOptions);

             watch.then(
             null,
             function(err) {
             // error
             },
             function(position) {
             $scope.lat  = position.coords.latitude
             $scope.long = position.coords.longitude
             });


             watch.clearWatch();

             // OR
             // $cordovaGeolocation.clearWatch(watch)
             // .then(function(result) {
             //     // success
             // }, function (error) {
             //     // error
             // });
             var initialize = function () {
             var myLatlng = new google.maps.LatLng($scope.lat, $scope.long);

             var mapOptions = {
             center: myLatlng,
             zoom: 16,
             mapTypeId: google.maps.MapTypeId.ROADMAP
             };
             var map = new google.maps.Map(document.getElementById("map"),
             mapOptions);

             var marker = new google.maps.Marker({
             position: myLatlng,
             map: map,
             title: 'Uluru (Ayers Rock)'
             });

             google.maps.event.addListener(marker, 'click', function() {
             infowindow.open(map,marker);
             });
             $scope.map = map;
             }
             google.maps.event.addDomListener(window, 'load', initialize);
             현재위치로 맵 띄우기 예제 */
        }]);
