function LoginController($location) {
    const ctrl = this;
    const username = 'anil';
    const password = 'India@123';
    let isLoginFailed = false;

    ctrl.login = function (credentials) {
        if (credentials && credentials.username === username && credentials.password === password) {
            isLoginFailed = false;
            localStorage.setItem('login', true);
            $location.path('/dashboard');
            return;
        }

        isLoginFailed = true;
        ctrl.loginStatus = isLoginFailed;
        ctrl.loginErrorMessage = 'Invalid username or password!';
    }
}

LoginController.$inject = ['$location'];

angular.module('authentication').controller('LoginController', LoginController);
