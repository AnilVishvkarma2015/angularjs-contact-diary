function UserNewController(DashboardService) {
    const ctrl = this;
    
    ctrl.user = {};

    ctrl.newUser = function (user) {
        if (!user || !user.firstName) {
            return;
        }

        const newUser = {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            mobile: user.mobile,
            company: user.company,
            gender: user.gender
        };

        DashboardService.setNewContact(newUser);
        ctrl.user = {};
    }
}

UserNewController.$inject = ['DashboardService'];

angular.module('user').controller('UserNewController', UserNewController);
