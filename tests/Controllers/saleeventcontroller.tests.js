describe('saleEventController', function(){
    var scope;

    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('ChatDetailCtrl', {$scope: scope});
    }));

    // tests start here
    it('scope.settings.enableFriends', function(){
        expect(scope.settings.enableFriends).toEqual(true);
    });
});
