describe('saleEventController', function(){
    var scope;

    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('saleEventController', {$scope: scope});
    }));

    // tests start here
    it('scope.images', function(){
        expect(scope.images).toBeDefined();
    });

    it('name', function() {
        expect(scope.name).toEqual("할인 & 이벤트");
    });
});
