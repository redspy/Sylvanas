angular.module('starter.controllers')

.controller('localInformationController', function ($scope, $ionicModal, $timeout, $cordovaCamera, $cordovaFile, $state) {
    $scope.name = "주변 상점 정보";

    // 글쓰기에서 입력되는 Data 저장 : inputData
    $scope.inputData = [];

    // 글쓰기에서 입력되는 Data의 초기화
    $scope.refreshInputdata = function (){
        $scope.inputData = {
            title : '',
            nickName : window.localStorage['nickName'] || '',
            body : ''
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


    var heights = [225, 300, 375, 450];
    var widths = [75, 150, 225, 300, 375, 450, 500];
    var PictureType = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport'];
    $scope.items = [];
    //$scope.items = getData(10);

    function getRandomItem(arrObject) {
        var rndIndex = Math.floor((Math.random() * arrObject.length) + 1);
        return arrObject[rndIndex - 1];
    }

    function getData(amount) {
        var item = {};
        item = {
            id: 'Pic' + amount,
            pictureType: getRandomItem(PictureType),
            height: getRandomItem(heights),
            marketname : "강릉 중앙시장",
            name : "홍콩반점",
            favoritcount : "3",
            category : "짱깨",
            phone : "010-6521-6240",
            address : "강원도 강릉시 짜장면",
            width: 400
        };
        return item;
    }

    $scope.loadMore = function() {
        for (var i = 0; i < 10; i++) {
            $scope.items.push(getData($scope.items.length));
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    $scope.$on('$stateChangeSuccess', function() {
        if ($state.is('app.localinformation')) {
            $scope.loadMore();
        }
    });


    $scope.horizontalitems = [];

    for (var i = 0; i <= 5; i++) {
        var tmp = [
            {desc: 'The Ramones', image:'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSulfJcjBhxxW2NBBn9KbE3B4BSeh0R7mQ38wUi_zpJlQrMoDWh_qFcMelE_tjtAERUPTc'},
            {desc: 'The Beatles', image:'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTGpH07f9zeucoOs_stZyIFtBncU-Z8TDYmJgoFnlnxYmXjJEaitmxZNDkNvYnCzwWTySM'},
            {desc: 'Pink Floyd', image:'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT-FbU5dD_Wz472srRIvoZAhyGTEytx9HWGusbhYgSc2h0N6AqqRrDwzApmyxZoIlyxDcU'},
            {desc: 'The Rolling Stones', image:'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6uwPPBnHfAAUcSzxr3iq9ou1CZ4f_Zc2O76i5A4IyoymIVwjOMXwUFTGSrVGcdGT9vQY'},
            {desc: 'The Jimi Hendrix Experience', image:'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRA3jz0uhVypONAKWUve80Q6HASvuvZiohl4Sru5ZihkAsjWiaGjocfxd0aC3H7EeFk5-I'},
            {desc: 'Van Halen', image:'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRIslVN9cJJ6YuV0y7JihAyA63JDhXGhkCVxHIRE-IoaF-rpefjIXO5osA24QvN9iCptC8'}
        ];
        $scope.horizontalitems = $scope.horizontalitems.concat(tmp);
    };

    $scope.images = [];

    $scope.addImage = function() {
        // 2
        var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,// Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
        };

        // 3
        $cordovaCamera.getPicture(options).then(function(imageData) {

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

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
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

                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }

        }, function(err) {
            console.log(err);
        });
    }

    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
    }

    $scope.updateEditor = function() {
        var element = document.getElementById("input_textarea");
        element.style.height = element.scrollHeight + "px";
    };

});
