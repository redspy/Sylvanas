angular.module('starter.controllers')

    .factory('imageService', ['$resource', 'SERVICE_ENDPOINT', 'Upload', '$cordovaFileTransfer', '$q', '$http', function ($resource, SERVICE_ENDPOINT, Upload, $cordovaFileTransfer, $q, $http) {
        var IMAGE_SERVICE_ENDPOINT = SERVICE_ENDPOINT + '/images';
        var resource = $resource(IMAGE_SERVICE_ENDPOINT, {}, {
            delete: { method: 'DELETE' }
        });

        return {
            create: function (file) {
                var deferred = $q.defer();
                var options = new FileUploadOptions('image', '', 'image/jpeg', new Object());
                options.fileName = file.substr(file.lastIndexOf('/') + 1);
                options.headers = {
                    'X-Token': $http.defaults.headers.common['X-Token']
                };

                $cordovaFileTransfer.upload(SERVICE_ENDPOINT + '/images', file, options, true)
                    .then(function (result) {
                        deferred.resolve({
                            value: angular.fromJson(result.response),
                            response: result
                        });
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            modify: function (id, file) {
                return Upload.upload({
                    url: IMAGE_SERVICE_ENDPOINT + '/' + id,
                    method: 'POST',
                    file: file,
                    fileFormDataName: 'image'
                });
            },
            delete: resource.delete
        }
    }]);
