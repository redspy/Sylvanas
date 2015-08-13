angular.module('starter.controllers')

    .factory('imageService', ['$resource', 'SERVICE_ENDPOINT', 'Upload', '$cordovaFileTransfer', '$q', function ($resource, SERVICE_ENDPOINT, Upload, $cordovaFileTransfer, $q) {
        var IMAGE_SERVICE_ENDPOINT = SERVICE_ENDPOINT + '/images';
        var resource = $resource(IMAGE_SERVICE_ENDPOINT, {}, {
            delete: { method: 'DELETE' }
        });

        var defaultOptions = new FileUploadOptions('image', '', 'image/jpeg', new Object());

        return {
            create: function (file) {
                var deferred = $q.defer();
                var options = angular.extend(defaultOptions);
                options.fileName = file.substr(file.lastIndexOf('/') + 1);

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
