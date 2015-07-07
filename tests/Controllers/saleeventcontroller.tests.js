describe('saleEventController', function(){
    var scope;

    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('saleEventController', {$scope: scope});
    }));

    // tests start here
    it('scope.settings.enableFriends', function(){
        expect(scope.settings.enableFriends).toEqual(true);
    });

    // it('dummyfunction', function(){
    //     expect(dummyfunction()).toEqual(true);
    // });

    it('name', function() {
        expect(scope.name).toEqual("할인 & 이벤트");
    });
});
