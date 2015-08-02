/**
 * Created by ¿µÅÂ on 2015-08-02.
 */
angular.module('starter.controllers')

    .factory('imageService', ['$resource', 'SERVICE_ENDPOINT', 'Upload', function ($resource, SERVICE_ENDPOINT, Upload) {
        var IMAGE_SERVICE_ENDPOINT = SERVICE_ENDPOINT + '/images';
        var resource = $resource(IMAGE_SERVICE_ENDPOINT, {}, {
            delete: { method: 'DELETE' }
        });

        return {
            create: function (file) {
                return Upload.upload({
                    url: IMAGE_SERVICE_ENDPOINT,
                    method: 'POST',
                    file: file,
                    fileFormDataName: 'image'
                });
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
