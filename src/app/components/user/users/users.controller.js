function UsersController($scope, DashboardService) {
    const ctrl = this;
    ctrl.users = DashboardService.getDefaultContacts();

    ctrl.orderBySelectedValue = 'name';

    ctrl.orderByValue = function(value) {
        ctrl.orderBySelectedValue = value;
    }
}

UsersController.$inject = ['$scope', 'DashboardService'];

angular.module('user').controller('UsersController', UsersController);
