angular.module('starter.controllers')

.factory('introShopService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/intro/:id/:count', {}, {
            create: {
                method: 'POST'
            },
            readAll: {
                method: 'GET',
                isArray: true
            },
            read: {
                method: 'GET'
            },
            modify: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('introShops', ['$q', 'introShopService', function ($q, introShopService) {
        var initDeferred = undefined,
            nextDeferred = undefined;
        var service = introShopService;
        var items = [];
        var defers = [];

        function transform(item) {
            return item;
        }

        return {
            initialize: function () {
                initDeferred = $q.defer();
                service.readAll({
                    id: -1,
                    count: -1
                }, function (data) {
                    data.forEach(transform);
                    items = data;
                    initDeferred.resolve(items);
                });

                defers = [initDeferred.promise];
                return initDeferred.promise;
            },
            getNext: function () {

            },
            getItems: function () {
                var deferred = $q.defer();
                $q.all(defers).then(function () {
                    deferred.resolve(items);
                });

                return deferred.promise;
            },
            getItem: function (id) {
                var deferred = $q.defer();
                $q.all(defers).then(function () {
                    for (var i = 0; i < items.length - 1; i++) {
                        if (id == items[i].Id) {
                            deferred.resolve(items[i]);
                            return;
                        }
                    }
                });
                return deferred.promise;
            },
            refreshItem: function (id) {
                var deferred = $q.defer();
                $q.all(defers).then(function () {
                    for (var i = 0; i < items.length - 1; i++) {
                        if (id == items[i].Id) {
                            service.read({
                                id: id
                            }, function (item) {
                                angular.copy(transform(item), items[i]);
                                deferred.resolve(items[i]);
                            });
                            break;
                        }
                    }
                });
                return deferred.promise;
            },
            modifyItem: function (id, item) {
                var deferred = $q.defer();
                $q.all(defers).then(function () {
                    for (var i = 0; i < items.length - 1; i++) {
                        if (id == items[i].Id) {
                            service.modify({
                                id: id
                            }, item, function (item) {
                                angular.copy(transform(item), items[i]);
                                deferred.resolve(items[i]);
                            });
                            break;
                        }
                    }
                });
                return deferred.promise;
            },
            removeItem: function (id) {
                var deferred = $q.defer();
                $q.all(defers).then(function () {
                    for (var i = 0; i < items.length - 1; i++) {
                        if (id == items[i].Id) {
                            service.delete({
                                id: id
                            }, function () {
                                items.splice(i, 1);
                                deferred.resolve();
                            });
                            break;
                        }
                    }
                });
                return deferred.promise;
            }
        }
    }]);
