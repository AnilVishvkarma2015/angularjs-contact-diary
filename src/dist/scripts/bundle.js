angular.module('root', [
    'ngRoute',
    'dashboard',
    'user',
    'authentication',
    'mco'
]);

function routeProvider($routeProvider) {
    $routeProvider
        .when('/', {
            template: '<login></login>'
        })
        .when('/user/new', {
            template: '<user-new></user-new>'
        })
        .when('/users', {
            template: '<users></users>'
        })
        .when('/dashboard', {
            template: '<dashboard></dashboard>'
        })
        .when('/logout', {
            template: '<login></login>'
        })
        .when('/action-table', {
            template: '<action-table></action-table>'
        });
}
routeProvider.$inject = ['$routeProvider'];

angular.module('root')
    .config(routeProvider);

const sideNav = {
    templateUrl: './app/common/side-nav/side-nav.html',
    controller: SideNavController,
    bindings: {
        user: '<'
    }
};

angular.module('root').component('sideNav', sideNav);



function SideNavController($scope) {
    const ctrl = this;
}

SideNavController.$inject = ['$scope'];

angular.module('root').controller('SideNavController', SideNavController);
angular.module('authentication', []);
angular.module('mco', []);
const dashboard = {
    templateUrl: './app/components/dashboard/dashboard-index.html',
    controller: DashboardController
};

angular.module('root').component('dashboard', dashboard);
function DashboardController() {
    var ctrl = this;
}

angular.module('root').controller('DashboardController', DashboardController)
angular.module('dashboard', []);
angular.module('user', []);
const login = {
    templateUrl: './app/components/authentication/login/login.html',
    controller: LoginController
};

angular.module('authentication').component('login', login);

function LoginController($location) {
    const ctrl = this;
    const username = 'anil';
    const password = 'India@123';
    let isLoginFailed = false;

    ctrl.login = function (credentials) {
        console.log(credentials);
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
const actionTable = {
    templateUrl: './app/components/mco/action-table/action-table.html',
    controller: ActionTableController
};

angular.module('mco').component('actionTable', actionTable);

function ActionTableController($scope) {
    const ctrl = this;

    ctrl.mcoObjectDetails = {
        statesText: 'States',
        noOfStates: 4,
        relinquishDefault: 'State 0'
    };

    $scope.showCollapsibleActionTable = true;
    $scope.showNormalActionTable = false;

    ctrl.showCollapsibleTable = function () {
        $scope.showCollapsibleActionTable = true;
        $scope.showNormalActionTable = false;
    }

    ctrl.showNormalTable = function () {
        $scope.showNormalActionTable = true;
        $scope.showCollapsibleActionTable = false;
    }

    ctrl.mcoStates = [
        {
            stateName: 'State 10',
            status: true,
            stateAttributes: [
                {
                    item: 'AV01',
                    command: 'On',
                    priority: '16 (Default)',
                    delay: '10 Seconds'
                }, {
                    item: 'BV01',
                    command: 'Off',
                    priority: '16 (Default)',
                    delay: '20 Seconds'
                }
            ]
        },
        {
            stateName: 'State 20',
            stateAttributes: [
                {
                    item: 'AV10',
                    command: 'Cooling',
                    priority: '16 (Default)',
                    delay: '100 Seconds'
                }, {
                    item: 'BV20',
                    command: 'Heating',
                    priority: '16 (Default)',
                    delay: '200 Seconds'
                }
            ]
        },
        {
            stateName: 'State 30',
            stateAttributes: [
                {
                    item: 'AV10',
                    command: 'Cooling',
                    priority: '16 (Default)',
                    delay: '100 Seconds'
                }, {
                    item: 'BV20',
                    command: 'Heating',
                    priority: '16 (Default)',
                    delay: '200 Seconds'
                },
                {
                    item: 'AV30',
                    command: 'Cooling',
                    priority: '16 (Default)',
                    delay: '100 Seconds'
                }, {
                    item: 'BV40',
                    command: 'Heating',
                    priority: '16 (Default)',
                    delay: '200 Seconds'
                },
                {
                    item: 'AV50',
                    command: 'Cooling',
                    priority: '16 (Default)',
                    delay: '100 Seconds'
                }, {
                    item: 'BV60',
                    command: 'Heating',
                    priority: '16 (Default)',
                    delay: '200 Seconds'
                }
            ]
        },
        {
            stateName: 'State 40',
            stateAttributes: [
                {
                    item: 'AV10',
                    command: 'Cooling',
                    priority: '16 (Default)',
                    delay: '100 Seconds'
                }, {
                    item: 'BV20',
                    command: 'Heating',
                    priority: '16 (Default)',
                    delay: '200 Seconds'
                }
            ]
        }
    ]
}

ActionTableController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableController', ActionTableController);

const actionTableItemsNormal = {
    templateUrl: './app/components/mco/action-table-items-normal/action-table-items-normal.html',
    controller: ActionTableItemsNormalController,
    bindings: {
        items: '<'
    }
};

angular.module('mco').component('actionTableItemsNormal', actionTableItemsNormal);


function ActionTableItemsNormalController($scope) {
    const ctrl = this;
    this.$onInit = () => {
        console.log("Action Table Items =", ctrl.items);
    };

    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
        console.log("Toggle Data Clicked !!--", $scope.isExpanded)
    }
}

ActionTableItemsNormalController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableItemsNormalController', ActionTableItemsNormalController);

const actionTableItemsCollapsible = {
    templateUrl: './app/components/mco/action-table-items-collapsible/action-table-items-collapsible.html',
    controller: ActionTableItemsCollapsibleController,
    bindings: {
        items: '<'
    }
};

angular.module('mco').component('actionTableItemsCollapsible', actionTableItemsCollapsible);


function ActionTableItemsCollapsibleController($scope) {
    const ctrl = this;

    this.$onInit = () => {
        console.log("Action Table Items =", ctrl.items);
    };

    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
        console.log("Toggle Data Clicked !!--", $scope.isExpanded)
    }
}

ActionTableItemsCollapsibleController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableItemsCollapsibleController', ActionTableItemsCollapsibleController);

const userNew = {
  templateUrl: './app/components/user/user-new/user-new.html',
  controller: UserNewController,
  bindings: {
    user: '<'
  }
}

angular.module('user').component('userNew', userNew);

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

            /* var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000); */
            ctrl.user = {};
            return;
        }
    };
}

angular.module('user').controller('UserNewController', UserNewController);

const dashboardCards = {
    templateUrl: './app/components/dashboard/dashboard-cards/dashboard-cards.html',
    controller: DashboardCardsController,
    bindings: {
        users: '<'
    }
}

angular.module('dashboard').component('dashboardCards', dashboardCards);

function DashboardCardsController() {
    const ctrl = this;
    const payload = JSON.parse(localStorage.getItem('users'))

    if (payload && payload.length > 0) {
        ctrl.users = payload;
        return;
    }
}

angular.module('dashboard').controller('DashboardCardsController', DashboardCardsController);
const users = {
    templateUrl: './app/components/user/users/users.html',
    controller: UsersController,
    bindings: {
        users: '<',
        editUser: '<'
    }
};

angular.module('user').component('users', users);

function UsersController() {
    const ctrl = this;
    const users = JSON.parse(localStorage.getItem('users'));
    ctrl.users = users;

    ctrl.editUser = function(userSelected) {
        console.log(userSelected);
    }
}

angular.module('user').controller('UsersController', UsersController);

const topNavLogin = {
    templateUrl: './app/common/top-nav/top-nav-login/top-nav-login.html',
    controller: TopNavLoginController,
    bindings: {
        user: '<'
    }
};

angular.module('root').component('topNavLogin', topNavLogin);
function TopNavLoginController() {
    const ctrl = this;
    const userResponse = [
        {
            "name": "Anil Vishvkarma",
            "email": "anil.vishvkarma@jci.com",
            "mobile": "971344864",
            "company": "Johnson Controls India Pvt. Ltd.",
            "gender": "male"
        },
        {
            "name": "Akshay Soni",
            "email": "akshay.soni@gmail.com",
            "mobile": "9753632727",
            "company": "Impetus Limited",
            "gender": "male"
        },
        {
            "name": "Sunil Soni",
            "email": "sunil.soni@barclays.com",
            "mobile": "971344864",
            "company": "Barclays Technology",
            "gender": "male"
        },
        {
            "name": "Deepak Ahirwal",
            "email": "deepak.ahirwal@cg.com",
            "mobile": "971344864",
            "company": "Cognizent Technology.",
            "gender": "male"
        },
        {
            "name": "Piyush Vijayvargiya",
            "email": "piyush.vgy@techm.com",
            "mobile": "971344864",
            "company": "Tech Mahindra",
            "gender": "male"
        },
        {
            "name": "Elyse Hobson",
            "email": "elyse@jci.com",
            "mobile": "971344864",
            "company": "Johnson Controls Inc.",
            "gender": "female"
        }
    ];

    localStorage.setItem('users', JSON.stringify(userResponse));

}

angular.module("root").controller("TopNavLoginController", TopNavLoginController);
const topNavLogout = {
    templateUrl: './app/common/top-nav/top-nav-logout/top-nav-logout.html',
    controller: TopNavLogoutController
};

angular.module('root').component('topNavLogout', topNavLogout);
function TopNavLogoutController() {
    const ctrl = this;
}

angular.module("root").controller("TopNavLogoutController", TopNavLogoutController);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAucm91dGVzLmpzIiwiY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2LmNvbXBvbmVudC5qcyIsImNvbW1vbi9zaWRlLW5hdi9zaWRlLW5hdi5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9hdXRoZW50aWNhdGlvbi5tb2R1bGUuanMiLCJjb21wb25lbnRzL21jby9tY28ubW9kdWxlLmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWluZGV4LmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1pbmRleC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4vbG9naW4uY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlL2FjdGlvbi10YWJsZS5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUvYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlci1uZXcvdXNlci1uZXcuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5jb250cm9sbGVyLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dpbi90b3AtbmF2LWxvZ2luLmNvbXBvbmVudC5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5jb250cm9sbGVyLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29tcG9uZW50LmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgncm9vdCcsIFtcclxuICAgICduZ1JvdXRlJyxcclxuICAgICdkYXNoYm9hcmQnLFxyXG4gICAgJ3VzZXInLFxyXG4gICAgJ2F1dGhlbnRpY2F0aW9uJyxcclxuICAgICdtY28nXHJcbl0pO1xyXG4iLCJmdW5jdGlvbiByb3V0ZVByb3ZpZGVyKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxsb2dpbj48L2xvZ2luPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvdXNlci9uZXcnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVzZXItbmV3PjwvdXNlci1uZXc+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy91c2VycycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8dXNlcnM+PC91c2Vycz4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Rhc2hib2FyZCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGFzaGJvYXJkPjwvZGFzaGJvYXJkPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvbG9nb3V0Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxsb2dpbj48L2xvZ2luPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYWN0aW9uLXRhYmxlJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxhY3Rpb24tdGFibGU+PC9hY3Rpb24tdGFibGU+J1xyXG4gICAgICAgIH0pO1xyXG59XHJcbnJvdXRlUHJvdmlkZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JylcclxuICAgIC5jb25maWcocm91dGVQcm92aWRlcik7XHJcbiIsImNvbnN0IHNpZGVOYXYgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbW1vbi9zaWRlLW5hdi9zaWRlLW5hdi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFNpZGVOYXZDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB1c2VyOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29tcG9uZW50KCdzaWRlTmF2Jywgc2lkZU5hdik7XHJcblxyXG4iLCJcclxuZnVuY3Rpb24gU2lkZU5hdkNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxufVxyXG5cclxuU2lkZU5hdkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbnRyb2xsZXIoJ1NpZGVOYXZDb250cm9sbGVyJywgU2lkZU5hdkNvbnRyb2xsZXIpOyIsImFuZ3VsYXIubW9kdWxlKCdhdXRoZW50aWNhdGlvbicsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnbWNvJywgW10pOyIsImNvbnN0IGRhc2hib2FyZCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWluZGV4Lmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogRGFzaGJvYXJkQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ2Rhc2hib2FyZCcsIGRhc2hib2FyZCk7IiwiZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciBjdHJsID0gdGhpcztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcikiLCJhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCd1c2VyJywgW10pOyIsImNvbnN0IGxvZ2luID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2xvZ2luL2xvZ2luLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogTG9naW5Db250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXV0aGVudGljYXRpb24nKS5jb21wb25lbnQoJ2xvZ2luJywgbG9naW4pO1xyXG4iLCJmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoJGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gJ2FuaWwnO1xyXG4gICAgY29uc3QgcGFzc3dvcmQgPSAnSW5kaWFAMTIzJztcclxuICAgIGxldCBpc0xvZ2luRmFpbGVkID0gZmFsc2U7XHJcblxyXG4gICAgY3RybC5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNyZWRlbnRpYWxzKTtcclxuICAgICAgICBpZiAoY3JlZGVudGlhbHMgJiYgY3JlZGVudGlhbHMudXNlcm5hbWUgPT09IHVzZXJuYW1lICYmIGNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSBwYXNzd29yZCkge1xyXG4gICAgICAgICAgICBpc0xvZ2luRmFpbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dpbicsIHRydWUpO1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Rhc2hib2FyZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpc0xvZ2luRmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICBjdHJsLmxvZ2luU3RhdHVzID0gaXNMb2dpbkZhaWxlZDtcclxuICAgICAgICBjdHJsLmxvZ2luRXJyb3JNZXNzYWdlID0gJ0ludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQhJztcclxuICAgIH1cclxufVxyXG5cclxuTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTsiLCJjb25zdCBhY3Rpb25UYWJsZSA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlL2FjdGlvbi10YWJsZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IEFjdGlvblRhYmxlQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbXBvbmVudCgnYWN0aW9uVGFibGUnLCBhY3Rpb25UYWJsZSk7XHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG5cclxuICAgIGN0cmwubWNvT2JqZWN0RGV0YWlscyA9IHtcclxuICAgICAgICBzdGF0ZXNUZXh0OiAnU3RhdGVzJyxcclxuICAgICAgICBub09mU3RhdGVzOiA0LFxyXG4gICAgICAgIHJlbGlucXVpc2hEZWZhdWx0OiAnU3RhdGUgMCdcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNob3dDb2xsYXBzaWJsZUFjdGlvblRhYmxlID0gdHJ1ZTtcclxuICAgICRzY29wZS5zaG93Tm9ybWFsQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuXHJcbiAgICBjdHJsLnNob3dDb2xsYXBzaWJsZVRhYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5zaG93Q29sbGFwc2libGVBY3Rpb25UYWJsZSA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLnNob3dOb3JtYWxBY3Rpb25UYWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwuc2hvd05vcm1hbFRhYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5zaG93Tm9ybWFsQWN0aW9uVGFibGUgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5zaG93Q29sbGFwc2libGVBY3Rpb25UYWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwubWNvU3RhdGVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhdGVOYW1lOiAnU3RhdGUgMTAnLFxyXG4gICAgICAgICAgICBzdGF0dXM6IHRydWUsXHJcbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjAxJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnT24nLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWMDEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdPZmYnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhdGVOYW1lOiAnU3RhdGUgMjAnLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYxMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0Nvb2xpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjIwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnSGVhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhdGVOYW1lOiAnU3RhdGUgMzAnLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYxMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0Nvb2xpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjIwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnSGVhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjMwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnQ29vbGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWNDAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdIZWF0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWNTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlY2MCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDQwJyxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYyMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XHJcblxyXG5BY3Rpb25UYWJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29udHJvbGxlcignQWN0aW9uVGFibGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVDb250cm9sbGVyKTtcclxuIiwiY29uc3QgYWN0aW9uVGFibGVJdGVtc05vcm1hbCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIGl0ZW1zOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlSXRlbXNOb3JtYWwnLCBhY3Rpb25UYWJsZUl0ZW1zTm9ybWFsKTtcclxuXHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICB0aGlzLiRvbkluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBY3Rpb24gVGFibGUgSXRlbXMgPVwiLCBjdHJsLml0ZW1zKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgY3RybC50b2dnbGVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5pc0V4cGFuZGVkID0gISgkc2NvcGUuaXNFeHBhbmRlZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUb2dnbGUgRGF0YSBDbGlja2VkICEhLS1cIiwgJHNjb3BlLmlzRXhwYW5kZWQpXHJcbiAgICB9XHJcbn1cclxuXHJcbkFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCBhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBpdGVtczogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUnLCBhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUpO1xyXG5cclxuIiwiZnVuY3Rpb24gQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuJG9uSW5pdCA9ICgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBUYWJsZSBJdGVtcyA9XCIsIGN0cmwuaXRlbXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICBjdHJsLnRvZ2dsZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmlzRXhwYW5kZWQgPSAhKCRzY29wZS5pc0V4cGFuZGVkKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRvZ2dsZSBEYXRhIENsaWNrZWQgISEtLVwiLCAkc2NvcGUuaXNFeHBhbmRlZClcclxuICAgIH1cclxufVxyXG5cclxuQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb250cm9sbGVyKCdBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcik7XHJcbiIsImNvbnN0IHVzZXJOZXcgPSB7XHJcbiAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3VzZXIvdXNlci1uZXcvdXNlci1uZXcuaHRtbCcsXHJcbiAgY29udHJvbGxlcjogVXNlck5ld0NvbnRyb2xsZXIsXHJcbiAgYmluZGluZ3M6IHtcclxuICAgIHVzZXI6ICc8J1xyXG4gIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb21wb25lbnQoJ3VzZXJOZXcnLCB1c2VyTmV3KTtcclxuIiwiZnVuY3Rpb24gVXNlck5ld0NvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIGN0cmwudXNlciA9IHt9O1xyXG5cclxuICAgIGN0cmwubmV3VXNlciA9IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ05ldyBVc2VyIFN1Ym1pdHRlZDonLCB1c2VyKTtcclxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXIuZmlyc3ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1VzZXIgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGAke3VzZXIuZmlyc3ROYW1lfSAke3VzZXIubGFzdE5hbWV9YCxcclxuICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIG1vYmlsZTogdXNlci5tb2JpbGUsXHJcbiAgICAgICAgICAgIGNvbXBhbnk6IHVzZXIuY29tcGFueSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB1c2VyLmdlbmRlclxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nVXNlcnMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKTtcclxuXHJcbiAgICAgICAgaWYgKGV4aXN0aW5nVXNlcnMgJiYgZXhpc3RpbmdVc2Vycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGV4aXN0aW5nVXNlcnMucHVzaChuZXdVc2VyKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkoZXhpc3RpbmdVc2VycykpO1xyXG5cclxuICAgICAgICAgICAgLyogdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNuYWNrYmFyXCIpO1xyXG4gICAgICAgICAgICB4LmNsYXNzTmFtZSA9IFwic2hvd1wiO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgeC5jbGFzc05hbWUgPSB4LmNsYXNzTmFtZS5yZXBsYWNlKFwic2hvd1wiLCBcIlwiKTsgfSwgMzAwMCk7ICovXHJcbiAgICAgICAgICAgIGN0cmwudXNlciA9IHt9O1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb250cm9sbGVyKCdVc2VyTmV3Q29udHJvbGxlcicsIFVzZXJOZXdDb250cm9sbGVyKTtcclxuIiwiY29uc3QgZGFzaGJvYXJkQ2FyZHMgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIHVzZXJzOiAnPCdcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbXBvbmVudCgnZGFzaGJvYXJkQ2FyZHMnLCBkYXNoYm9hcmRDYXJkcyk7XHJcbiIsImZ1bmN0aW9uIERhc2hib2FyZENhcmRzQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgcGF5bG9hZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJzJykpXHJcblxyXG4gICAgaWYgKHBheWxvYWQgJiYgcGF5bG9hZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY3RybC51c2VycyA9IHBheWxvYWQ7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyJywgRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyKTsiLCJjb25zdCB1c2VycyA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogVXNlcnNDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB1c2VyczogJzwnLFxyXG4gICAgICAgIGVkaXRVc2VyOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29tcG9uZW50KCd1c2VycycsIHVzZXJzKTtcclxuIiwiZnVuY3Rpb24gVXNlcnNDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCB1c2VycyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJzJykpO1xyXG4gICAgY3RybC51c2VycyA9IHVzZXJzO1xyXG5cclxuICAgIGN0cmwuZWRpdFVzZXIgPSBmdW5jdGlvbih1c2VyU2VsZWN0ZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh1c2VyU2VsZWN0ZWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbnRyb2xsZXIoJ1VzZXJzQ29udHJvbGxlcicsIFVzZXJzQ29udHJvbGxlcik7IiwiXHJcbmNvbnN0IHRvcE5hdkxvZ2luID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ2luL3RvcC1uYXYtbG9naW4uaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dpbkNvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIHVzZXI6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3RvcE5hdkxvZ2luJywgdG9wTmF2TG9naW4pOyIsImZ1bmN0aW9uIFRvcE5hdkxvZ2luQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgdXNlclJlc3BvbnNlID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiQW5pbCBWaXNodmthcm1hXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJhbmlsLnZpc2h2a2FybWFAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluZGlhIFB2dC4gTHRkLlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJBa3NoYXkgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiYWtzaGF5LnNvbmlAZ21haWwuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTc1MzYzMjcyN1wiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJJbXBldHVzIExpbWl0ZWRcIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VuaWwgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwic3VuaWwuc29uaUBiYXJjbGF5cy5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiQmFyY2xheXMgVGVjaG5vbG9neVwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJEZWVwYWsgQWhpcndhbFwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZGVlcGFrLmFoaXJ3YWxAY2cuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkNvZ25pemVudCBUZWNobm9sb2d5LlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJQaXl1c2ggVmlqYXl2YXJnaXlhXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJwaXl1c2gudmd5QHRlY2htLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJUZWNoIE1haGluZHJhXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkVseXNlIEhvYnNvblwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZWx5c2VAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluYy5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJmZW1hbGVcIlxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkodXNlclJlc3BvbnNlKSk7XHJcblxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInJvb3RcIikuY29udHJvbGxlcihcIlRvcE5hdkxvZ2luQ29udHJvbGxlclwiLCBUb3BOYXZMb2dpbkNvbnRyb2xsZXIpOyIsImNvbnN0IHRvcE5hdkxvZ291dCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dvdXRDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgndG9wTmF2TG9nb3V0JywgdG9wTmF2TG9nb3V0KTsiLCJmdW5jdGlvbiBUb3BOYXZMb2dvdXRDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwicm9vdFwiKS5jb250cm9sbGVyKFwiVG9wTmF2TG9nb3V0Q29udHJvbGxlclwiLCBUb3BOYXZMb2dvdXRDb250cm9sbGVyKTsiXX0=
