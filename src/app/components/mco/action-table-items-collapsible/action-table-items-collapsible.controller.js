function ActionTableItemsCollapsibleController($scope) {
    const ctrl = this;

    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
    }
}

ActionTableItemsCollapsibleController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableItemsCollapsibleController', ActionTableItemsCollapsibleController);
