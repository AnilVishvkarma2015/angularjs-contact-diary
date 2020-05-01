function ActionTableItemsNormalController($scope) {
    const ctrl = this;
   
    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
    }
}

ActionTableItemsNormalController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableItemsNormalController', ActionTableItemsNormalController);
