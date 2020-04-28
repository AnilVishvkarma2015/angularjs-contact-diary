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

angular.module('root').config(routeProvider);

const sideNav = {
    templateUrl: './app/common/side-nav/side-nav.html',
    controller: SideNavController
};

angular.module('root').component('sideNav', sideNav);

function SideNavController(WheatherService) {
    const ctrl = this;

    const existingData = JSON.parse(localStorage.getItem('wheather'));

    console.log(existingData);

    if (existingData) {
        ctrl.wheatherData = existingData;
        return;
    }

    WheatherService.getWheatherDetails()
        .then(data => {
            ctrl.wheatherData = data;
            localStorage.setItem('wheather', JSON.stringify(data));
        }).catch(err => {
            console.log("Wheather API Error : ", err);
            ctrl.errorMessage = err;
        })
}

SideNavController.$inject = ['WheatherService'];

angular.module('root').controller('SideNavController', SideNavController);
function WheatherService($http, $q) {
    this.getWheatherDetails = function () {
        const deferred = $q.defer();

        $http({ method: 'GET', url: 'http://api.weatherstack.com/current?access_key=db8c7f80c551e966d8e07faec78cfe47&query=Pune' })
            .then(function (response) {
                if (response.status !== 200) {
                    const errorMessage = "Wheather response is not in 200 status code. Please try again after some time."
                    deferred.resolve(errorMessage);
                    return;
                }

                const responseData = response.data;

                let wheatherData = {
                    city: responseData.location.name,
                    state: responseData.location.region,
                    country: responseData.location.country,
                    temp: responseData.current.temperature,
                    pressure: responseData.current.pressure,
                    wind: responseData.current.wind_speed,
                    cloudState: responseData.current.weather_descriptions[0]
                };
                
                deferred.resolve(wheatherData);
            }, function (err) {
                console.log(err);
                deferred.reject(err);
            });

        return deferred.promise;
    }
}

WheatherService.$inject = ['$http', '$q'];

angular.module('root').service('WheatherService', WheatherService);


angular.module('authentication', []);
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
angular.module('mco', []);
angular.module('user', []);

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

const login = {
    templateUrl: './app/components/authentication/login/login.html',
    controller: LoginController
};

angular.module('authentication').component('login', login);

function LoginController($location) {
    const ctrl = this;
    localStorage.removeItem('wheather');
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
       // console.log("Action Table Items =", ctrl.items);
    };

    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
        console.log("Toggle Data Clicked !!--", $scope.isExpanded)
    }
}

ActionTableItemsNormalController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableItemsNormalController', ActionTableItemsNormalController);

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
            ctrl.user = {};
            return;
        }
    };
}

angular.module('user').controller('UserNewController', UserNewController);

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
       // console.log("Action Table Items =", ctrl.items);
    };

    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
        console.log("Toggle Data Clicked !!--", $scope.isExpanded)
    }
}

ActionTableItemsCollapsibleController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableItemsCollapsibleController', ActionTableItemsCollapsibleController);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAucm91dGVzLmpzIiwiY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2LmNvbXBvbmVudC5qcyIsImNvbW1vbi9zaWRlLW5hdi9zaWRlLW5hdi5jb250cm9sbGVyLmpzIiwiY29tbW9uL3NpZGUtbmF2L3doZWF0aGVyLnNlcnZpY2UuanMiLCJjb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1pbmRleC5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQtaW5kZXguY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC5tb2R1bGUuanMiLCJjb21wb25lbnRzL21jby9tY28ubW9kdWxlLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXIubW9kdWxlLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dpbi90b3AtbmF2LWxvZ2luLmNvbXBvbmVudC5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5jb250cm9sbGVyLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29tcG9uZW50LmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlL2FjdGlvbi10YWJsZS5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4vbG9naW4uY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwvYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlci1uZXcvdXNlci1uZXcuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlcnMvdXNlcnMuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FDQUE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgncm9vdCcsIFtcclxuICAgICduZ1JvdXRlJyxcclxuICAgICdkYXNoYm9hcmQnLFxyXG4gICAgJ3VzZXInLFxyXG4gICAgJ2F1dGhlbnRpY2F0aW9uJyxcclxuICAgICdtY28nXHJcbl0pO1xyXG5cclxuIiwiZnVuY3Rpb24gcm91dGVQcm92aWRlcigkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8bG9naW4+PC9sb2dpbj4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3VzZXIvbmV3Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzx1c2VyLW5ldz48L3VzZXItbmV3PidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvdXNlcnMnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVzZXJzPjwvdXNlcnM+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9kYXNoYm9hcmQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRhc2hib2FyZD48L2Rhc2hib2FyZD4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2xvZ291dCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8bG9naW4+PC9sb2dpbj4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2FjdGlvbi10YWJsZScsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8YWN0aW9uLXRhYmxlPjwvYWN0aW9uLXRhYmxlPidcclxuICAgICAgICB9KTtcclxufVxyXG5yb3V0ZVByb3ZpZGVyLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbmZpZyhyb3V0ZVByb3ZpZGVyKTtcclxuIiwiY29uc3Qgc2lkZU5hdiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2Lmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogU2lkZU5hdkNvbnRyb2xsZXJcclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29tcG9uZW50KCdzaWRlTmF2Jywgc2lkZU5hdik7XHJcbiIsImZ1bmN0aW9uIFNpZGVOYXZDb250cm9sbGVyKFdoZWF0aGVyU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgY29uc3QgZXhpc3RpbmdEYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2hlYXRoZXInKSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coZXhpc3RpbmdEYXRhKTtcclxuXHJcbiAgICBpZiAoZXhpc3RpbmdEYXRhKSB7XHJcbiAgICAgICAgY3RybC53aGVhdGhlckRhdGEgPSBleGlzdGluZ0RhdGE7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIFdoZWF0aGVyU2VydmljZS5nZXRXaGVhdGhlckRldGFpbHMoKVxyXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjdHJsLndoZWF0aGVyRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3aGVhdGhlcicsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldoZWF0aGVyIEFQSSBFcnJvciA6IFwiLCBlcnIpO1xyXG4gICAgICAgICAgICBjdHJsLmVycm9yTWVzc2FnZSA9IGVycjtcclxuICAgICAgICB9KVxyXG59XHJcblxyXG5TaWRlTmF2Q29udHJvbGxlci4kaW5qZWN0ID0gWydXaGVhdGhlclNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29udHJvbGxlcignU2lkZU5hdkNvbnRyb2xsZXInLCBTaWRlTmF2Q29udHJvbGxlcik7IiwiZnVuY3Rpb24gV2hlYXRoZXJTZXJ2aWNlKCRodHRwLCAkcSkge1xyXG4gICAgdGhpcy5nZXRXaGVhdGhlckRldGFpbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJ2h0dHA6Ly9hcGkud2VhdGhlcnN0YWNrLmNvbS9jdXJyZW50P2FjY2Vzc19rZXk9ZGI4YzdmODBjNTUxZTk2NmQ4ZTA3ZmFlYzc4Y2ZlNDcmcXVlcnk9UHVuZScgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBcIldoZWF0aGVyIHJlc3BvbnNlIGlzIG5vdCBpbiAyMDAgc3RhdHVzIGNvZGUuIFBsZWFzZSB0cnkgYWdhaW4gYWZ0ZXIgc29tZSB0aW1lLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZURhdGEgPSByZXNwb25zZS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB3aGVhdGhlckRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2l0eTogcmVzcG9uc2VEYXRhLmxvY2F0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHJlc3BvbnNlRGF0YS5sb2NhdGlvbi5yZWdpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgY291bnRyeTogcmVzcG9uc2VEYXRhLmxvY2F0aW9uLmNvdW50cnksXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcDogcmVzcG9uc2VEYXRhLmN1cnJlbnQudGVtcGVyYXR1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlc3N1cmU6IHJlc3BvbnNlRGF0YS5jdXJyZW50LnByZXNzdXJlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmQ6IHJlc3BvbnNlRGF0YS5jdXJyZW50LndpbmRfc3BlZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvdWRTdGF0ZTogcmVzcG9uc2VEYXRhLmN1cnJlbnQud2VhdGhlcl9kZXNjcmlwdGlvbnNbMF1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUod2hlYXRoZXJEYXRhKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbldoZWF0aGVyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5zZXJ2aWNlKCdXaGVhdGhlclNlcnZpY2UnLCBXaGVhdGhlclNlcnZpY2UpO1xyXG5cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJywgW10pOyIsImNvbnN0IGRhc2hib2FyZCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWluZGV4Lmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogRGFzaGJvYXJkQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ2Rhc2hib2FyZCcsIGRhc2hib2FyZCk7IiwiZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciBjdHJsID0gdGhpcztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcikiLCJhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdtY28nLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ3VzZXInLCBbXSk7IiwiXHJcbmNvbnN0IHRvcE5hdkxvZ2luID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ2luL3RvcC1uYXYtbG9naW4uaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dpbkNvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIHVzZXI6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3RvcE5hdkxvZ2luJywgdG9wTmF2TG9naW4pOyIsImZ1bmN0aW9uIFRvcE5hdkxvZ2luQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgdXNlclJlc3BvbnNlID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiQW5pbCBWaXNodmthcm1hXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJhbmlsLnZpc2h2a2FybWFAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluZGlhIFB2dC4gTHRkLlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJBa3NoYXkgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiYWtzaGF5LnNvbmlAZ21haWwuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTc1MzYzMjcyN1wiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJJbXBldHVzIExpbWl0ZWRcIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VuaWwgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwic3VuaWwuc29uaUBiYXJjbGF5cy5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiQmFyY2xheXMgVGVjaG5vbG9neVwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJEZWVwYWsgQWhpcndhbFwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZGVlcGFrLmFoaXJ3YWxAY2cuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkNvZ25pemVudCBUZWNobm9sb2d5LlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJQaXl1c2ggVmlqYXl2YXJnaXlhXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJwaXl1c2gudmd5QHRlY2htLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJUZWNoIE1haGluZHJhXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkVseXNlIEhvYnNvblwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZWx5c2VAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluYy5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJmZW1hbGVcIlxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkodXNlclJlc3BvbnNlKSk7XHJcblxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInJvb3RcIikuY29udHJvbGxlcihcIlRvcE5hdkxvZ2luQ29udHJvbGxlclwiLCBUb3BOYXZMb2dpbkNvbnRyb2xsZXIpOyIsImNvbnN0IHRvcE5hdkxvZ291dCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dvdXRDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgndG9wTmF2TG9nb3V0JywgdG9wTmF2TG9nb3V0KTsiLCJmdW5jdGlvbiBUb3BOYXZMb2dvdXRDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwicm9vdFwiKS5jb250cm9sbGVyKFwiVG9wTmF2TG9nb3V0Q29udHJvbGxlclwiLCBUb3BOYXZMb2dvdXRDb250cm9sbGVyKTsiLCJjb25zdCBkYXNoYm9hcmRDYXJkcyA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IERhc2hib2FyZENhcmRzQ29udHJvbGxlcixcclxuICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgdXNlcnM6ICc8J1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29tcG9uZW50KCdkYXNoYm9hcmRDYXJkcycsIGRhc2hib2FyZENhcmRzKTtcclxuIiwiZnVuY3Rpb24gRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnMnKSlcclxuXHJcbiAgICBpZiAocGF5bG9hZCAmJiBwYXlsb2FkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjdHJsLnVzZXJzID0gcGF5bG9hZDtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXInLCBEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXIpOyIsImNvbnN0IGFjdGlvblRhYmxlID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZScsIGFjdGlvblRhYmxlKTtcclxuIiwiZnVuY3Rpb24gQWN0aW9uVGFibGVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgY3RybC5tY29PYmplY3REZXRhaWxzID0ge1xyXG4gICAgICAgIHN0YXRlc1RleHQ6ICdTdGF0ZXMnLFxyXG4gICAgICAgIG5vT2ZTdGF0ZXM6IDQsXHJcbiAgICAgICAgcmVsaW5xdWlzaERlZmF1bHQ6ICdTdGF0ZSAwJ1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSB0cnVlO1xyXG4gICAgJHNjb3BlLnNob3dOb3JtYWxBY3Rpb25UYWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIGN0cmwuc2hvd0NvbGxhcHNpYmxlVGFibGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnNob3dDb2xsYXBzaWJsZUFjdGlvblRhYmxlID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5zaG93Tm9ybWFsVGFibGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnNob3dOb3JtYWxBY3Rpb25UYWJsZSA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLnNob3dDb2xsYXBzaWJsZUFjdGlvblRhYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5tY29TdGF0ZXMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGF0ZU5hbWU6ICdTdGF0ZSAxMCcsXHJcbiAgICAgICAgICAgIHN0YXR1czogdHJ1ZSxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMDEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdPbicsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYwMScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ09mZicsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGF0ZU5hbWU6ICdTdGF0ZSAyMCcsXHJcbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjEwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnQ29vbGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWMjAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdIZWF0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGF0ZU5hbWU6ICdTdGF0ZSAzMCcsXHJcbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjEwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnQ29vbGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWMjAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdIZWF0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMzAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlY0MCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVY1MCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0Nvb2xpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjYwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnSGVhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhdGVOYW1lOiAnU3RhdGUgNDAnLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYxMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0Nvb2xpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjIwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnSGVhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cclxuXHJcbkFjdGlvblRhYmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb250cm9sbGVyKCdBY3Rpb25UYWJsZUNvbnRyb2xsZXInLCBBY3Rpb25UYWJsZUNvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCBsb2dpbiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29tcG9uZW50KCdsb2dpbicsIGxvZ2luKTtcclxuIiwiZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRsb2NhdGlvbikge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2hlYXRoZXInKTtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gJ2FuaWwnO1xyXG4gICAgY29uc3QgcGFzc3dvcmQgPSAnSW5kaWFAMTIzJztcclxuICAgIGxldCBpc0xvZ2luRmFpbGVkID0gZmFsc2U7XHJcblxyXG4gICAgY3RybC5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgICAgIGlmIChjcmVkZW50aWFscyAmJiBjcmVkZW50aWFscy51c2VybmFtZSA9PT0gdXNlcm5hbWUgJiYgY3JlZGVudGlhbHMucGFzc3dvcmQgPT09IHBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIGlzTG9naW5GYWlsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvZ2luJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlzTG9naW5GYWlsZWQgPSB0cnVlO1xyXG4gICAgICAgIGN0cmwubG9naW5TdGF0dXMgPSBpc0xvZ2luRmFpbGVkO1xyXG4gICAgICAgIGN0cmwubG9naW5FcnJvck1lc3NhZ2UgPSAnSW52YWxpZCB1c2VybmFtZSBvciBwYXNzd29yZCEnO1xyXG4gICAgfVxyXG59XHJcblxyXG5Mb2dpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJGxvY2F0aW9uJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXV0aGVudGljYXRpb24nKS5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBMb2dpbkNvbnRyb2xsZXIpOyIsImNvbnN0IGFjdGlvblRhYmxlSXRlbXNOb3JtYWwgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwvYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBpdGVtczogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZUl0ZW1zTm9ybWFsJywgYWN0aW9uVGFibGVJdGVtc05vcm1hbCk7XHJcblxyXG4iLCJmdW5jdGlvbiBBY3Rpb25UYWJsZUl0ZW1zTm9ybWFsQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgdGhpcy4kb25Jbml0ID0gKCkgPT4ge1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coXCJBY3Rpb24gVGFibGUgSXRlbXMgPVwiLCBjdHJsLml0ZW1zKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgY3RybC50b2dnbGVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5pc0V4cGFuZGVkID0gISgkc2NvcGUuaXNFeHBhbmRlZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUb2dnbGUgRGF0YSBDbGlja2VkICEhLS1cIiwgJHNjb3BlLmlzRXhwYW5kZWQpXHJcbiAgICB9XHJcbn1cclxuXHJcbkFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCB1c2VyTmV3ID0ge1xyXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy91c2VyL3VzZXItbmV3L3VzZXItbmV3Lmh0bWwnLFxyXG4gIGNvbnRyb2xsZXI6IFVzZXJOZXdDb250cm9sbGVyLFxyXG4gIGJpbmRpbmdzOiB7XHJcbiAgICB1c2VyOiAnPCdcclxuICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29tcG9uZW50KCd1c2VyTmV3JywgdXNlck5ldyk7XHJcbiIsImZ1bmN0aW9uIFVzZXJOZXdDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjdHJsLnVzZXIgPSB7fTtcclxuXHJcbiAgICBjdHJsLm5ld1VzZXIgPSBmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdOZXcgVXNlciBTdWJtaXR0ZWQ6JywgdXNlcik7XHJcbiAgICAgICAgaWYgKCF1c2VyIHx8ICF1c2VyLmZpcnN0TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdVc2VyID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBgJHt1c2VyLmZpcnN0TmFtZX0gJHt1c2VyLmxhc3ROYW1lfWAsXHJcbiAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBtb2JpbGU6IHVzZXIubW9iaWxlLFxyXG4gICAgICAgICAgICBjb21wYW55OiB1c2VyLmNvbXBhbnksXHJcbiAgICAgICAgICAgIGdlbmRlcjogdXNlci5nZW5kZXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBleGlzdGluZ1VzZXJzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnMnKSk7XHJcblxyXG4gICAgICAgIGlmIChleGlzdGluZ1VzZXJzICYmIGV4aXN0aW5nVXNlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBleGlzdGluZ1VzZXJzLnB1c2gobmV3VXNlcik7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycycsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nVXNlcnMpKTtcclxuICAgICAgICAgICAgY3RybC51c2VyID0ge307XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbnRyb2xsZXIoJ1VzZXJOZXdDb250cm9sbGVyJywgVXNlck5ld0NvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCB1c2VycyA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogVXNlcnNDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB1c2VyczogJzwnLFxyXG4gICAgICAgIGVkaXRVc2VyOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29tcG9uZW50KCd1c2VycycsIHVzZXJzKTtcclxuIiwiZnVuY3Rpb24gVXNlcnNDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCB1c2VycyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJzJykpO1xyXG4gICAgY3RybC51c2VycyA9IHVzZXJzO1xyXG5cclxuICAgIGN0cmwuZWRpdFVzZXIgPSBmdW5jdGlvbih1c2VyU2VsZWN0ZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh1c2VyU2VsZWN0ZWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbnRyb2xsZXIoJ1VzZXJzQ29udHJvbGxlcicsIFVzZXJzQ29udHJvbGxlcik7IiwiY29uc3QgYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUvYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcixcclxuICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgaXRlbXM6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbXBvbmVudCgnYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlJywgYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlKTtcclxuXHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuXHJcbiAgICB0aGlzLiRvbkluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFjdGlvbiBUYWJsZSBJdGVtcyA9XCIsIGN0cmwuaXRlbXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICBjdHJsLnRvZ2dsZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmlzRXhwYW5kZWQgPSAhKCRzY29wZS5pc0V4cGFuZGVkKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRvZ2dsZSBEYXRhIENsaWNrZWQgISEtLVwiLCAkc2NvcGUuaXNFeHBhbmRlZClcclxuICAgIH1cclxufVxyXG5cclxuQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb250cm9sbGVyKCdBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcik7XHJcbiJdfQ==
