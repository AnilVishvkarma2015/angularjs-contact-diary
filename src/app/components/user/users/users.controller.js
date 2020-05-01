function UsersController() {
    const ctrl = this;
    const users = JSON.parse(localStorage.getItem('users'));
    ctrl.users = users;
}

angular.module('user').controller('UsersController', UsersController);
