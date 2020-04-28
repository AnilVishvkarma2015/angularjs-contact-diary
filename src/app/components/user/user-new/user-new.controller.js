function UserNewController() {
    const ctrl = this;
    ctrl.user = {};

    ctrl.newUser = function (user) {
        console.log('New User Submitted:', user);
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

        const existingUsers = JSON.parse(localStorage.getItem('users'));

        if (existingUsers && existingUsers.length > 0) {
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            ctrl.user = {};
            return;
        }
    };
}

angular.module('user').controller('UserNewController', UserNewController);
