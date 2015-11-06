angular.module('starter.controllers')

    .factory('authenticationService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        return $resource(SERVICE_ENDPOINT + '/user', {}, {
            login: {
                method: 'POST'
            },
            isLoggedIn: {
                method: 'GET'
            },
            logout: {
                method: 'DELETE'
            },
            updateGCMToken: {
                method: 'PUT'
            }
        });
    }])
    .factory('encryptService', function () {
        'use strict';
        var CryptoJSAesJson = {
            stringify: function (cipherParams) {
                var j = {
                    ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
                };
                if (cipherParams.iv) j.iv = cipherParams.iv.toString();
                if (cipherParams.salt) j.s = cipherParams.salt.toString();
                return JSON.stringify(j);
            },
            parse: function (jsonStr) {
                var j = JSON.parse(jsonStr);
                var cipherParams = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Base64.parse(j.ct)
                });
                if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
                if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
                return cipherParams;
            }
        };

        return function (publicKey, data) {
            var passphase = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
            var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);

            var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), passphase, {
                iv: iv,
                format: CryptoJSAesJson
            }).toString();

            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);
            var encryptedKey = encrypt.encrypt(passphase);

            return {
                key: encryptedKey,
                data: encryptedData
            };
        };
    })
    .factory('loginService', function ($q, certService, encryptService, authenticationService, $cordovaDevice, $http, pushService) {
        var deferred = $q.defer();

        ionic.Platform.ready(function () {
            $q.all([certService]).then(function (data) {
                var now = new Date();
                var time = now.getTime();
                var loginData = '';

                if (ionic.Platform.platform() == 'win32' || ionic.Platform.platform() == 'macintel') {
                    loginData = angular.fromJson({
                        'Now': parseInt(time / 1000),
                        'DeviceUUID': 'WINDOW_DEBUG_DEVICE',
                        'DeviceOS': ionic.Platform.platform()
                    });
                } else {
                    loginData = angular.fromJson({
                        'Now': parseInt(time / 1000),
                        'DeviceUUID': $cordovaDevice.getUUID(),
                        'DeviceOS': ionic.Platform.platform()
                    });
                }

                var publicKey = data[0].data;

                var encryptedLoginData = encryptService(publicKey, loginData);

                delete $http.defaults.headers.common['X-Token'];
                authenticationService.login(encryptedLoginData, function (response) {
                    $http.defaults.headers.common['X-Token'] = response.token;
                    var tokens = response.token.split('.');
                    console.log('login success');
                    deferred.resolve(atob(tokens[1]));

                    pushService.getToken().then(function (token) {
                        authenticationService.updateGCMToken({
                            'Token': token
                        });
                    });
                }, function (error) {
                    delete $http.defaults.headers.common['X-Token'];
                    console.log('login failed', error);
                    deferred.reject(error);
                });
            })
        });
        return deferred.promise;
    });
