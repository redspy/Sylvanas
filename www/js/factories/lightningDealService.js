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

            item.EndDate = end.getTime() - now.getTimezoneOffset() * 60 * 1000;
            item.Duration = Math.max((end.getTime() - (now.getTime() + now.getTimezoneOffset() * 60 * 1000)) / 1000, 0);

            return item;
        }

        return {
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
