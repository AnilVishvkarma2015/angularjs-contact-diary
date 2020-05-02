function DashboardCardsController(DashboardService) {
    const ctrl = this;
    ctrl.users = DashboardService.getDefaultContacts();
}

DashboardCardsController.$inject = ['DashboardService']

angular.module('dashboard').controller('DashboardCardsController', DashboardCardsController);