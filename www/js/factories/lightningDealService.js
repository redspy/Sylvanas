angular.module('starter.controllers')

.factory('lightningDealService', ['$resource', 'SERVICE_ENDPOINT', function ($resource, SERVICE_ENDPOINT) {
        'use strict';
        return $resource(SERVICE_ENDPOINT + '/deal/:id/:count', {}, {
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
    .factory('lightningDeals', ['$q', 'lightningDealService', function ($q, lightningDealService) {
        var initDeferred = undefined,
            nextDeferred = undefined;
        var service = lightningDealService;
        var items = [];
        var defers = [];

        function transform(item) {
            var now = new Date();
            var end = new Date(item.EndDate);

            item.Duration = (end.getTime() - now.getTime()) / 1000;

            return item;
        }

        var self = {
            initialize: function () {
                initDeferred = $q.defer();
                service.readAll({
                    id: -1,
                    count: 10
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
                    for (var i = 0; i < items.length; i++) {
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
                    for (var i = 0; i < items.length; i++) {
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
                    service.modify({
                        id: id
                    }, item, function () {
                        self.refreshItem(id).then(function (item) {
                            deferred.resolve(item);
                        });
                    });
                });
                return deferred.promise;
            },
            removeItem: function (id) {
                var deferred = $q.defer();
                $q.all(defers).then(function () {
                    for (var i = 0; i < items.length; i++) {
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
        };

        return self;
    }]);
