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
function convertKelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return 'below absolute zero (0 K)';
    } else {
        let convertedTemp = (kelvin - 273.15);
        return Math.round(convertedTemp);
    }
}

function convertTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

function WheatherService($http, $q) {
    this.getWheatherDetails = function () {
        const deferred = $q.defer();

        $http({ method: 'GET', url: 'https://api.openweathermap.org/data/2.5/weather?q=pune,in&appid=0a432490e7ea75a3c85f5950640d256d' })
            .then(function (response) {
                console.log("response --", response);
                if (response.status !== 200) {
                    const errorMessage = "Wheather response is not in 200 status code. Please try again after some time."
                    deferred.resolve(errorMessage);
                    return;
                }

                const responseData = response.data;

                let wheatherData = {
                    city: responseData.name,
                    state: 'Maharashtra',
                    country: 'India',
                    temp: convertKelvinToCelsius(responseData.main.temp),
                    sunrise: convertTime(responseData.sys.sunrise),
                    sunset: convertTime(responseData.sys.sunset),
                    cloudState: responseData.weather[0].description
                };

                console.log("wheatherData --", wheatherData)

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
angular.module('mco', []);
angular.module('user', []);
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

const topNavLogout = {
    templateUrl: './app/common/top-nav/top-nav-logout/top-nav-logout.html',
    controller: TopNavLogoutController
};

angular.module('root').component('topNavLogout', topNavLogout);
function TopNavLogoutController() {
    const ctrl = this;
}


angular.module("root").controller("TopNavLogoutController", TopNavLogoutController);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAucm91dGVzLmpzIiwiY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2LmNvbXBvbmVudC5qcyIsImNvbW1vbi9zaWRlLW5hdi9zaWRlLW5hdi5jb250cm9sbGVyLmpzIiwiY29tbW9uL3NpZGUtbmF2L3doZWF0aGVyLnNlcnZpY2UuanMiLCJjb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvbWNvL21jby5tb2R1bGUuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlci5tb2R1bGUuanMiLCJjb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQtaW5kZXguY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWluZGV4LmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQubW9kdWxlLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dpbi90b3AtbmF2LWxvZ2luLmNvbXBvbmVudC5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlL2FjdGlvbi10YWJsZS5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4vbG9naW4uY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwvYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXItbmV3L3VzZXItbmV3LmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5jb250cm9sbGVyLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29tcG9uZW50LmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlcnMvdXNlcnMuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdyb290JywgW1xyXG4gICAgJ25nUm91dGUnLFxyXG4gICAgJ2Rhc2hib2FyZCcsXHJcbiAgICAndXNlcicsXHJcbiAgICAnYXV0aGVudGljYXRpb24nLFxyXG4gICAgJ21jbydcclxuXSk7XHJcblxyXG4iLCJmdW5jdGlvbiByb3V0ZVByb3ZpZGVyKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxsb2dpbj48L2xvZ2luPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvdXNlci9uZXcnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVzZXItbmV3PjwvdXNlci1uZXc+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy91c2VycycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8dXNlcnM+PC91c2Vycz4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2Rhc2hib2FyZCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGFzaGJvYXJkPjwvZGFzaGJvYXJkPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvbG9nb3V0Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxsb2dpbj48L2xvZ2luPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvYWN0aW9uLXRhYmxlJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxhY3Rpb24tdGFibGU+PC9hY3Rpb24tdGFibGU+J1xyXG4gICAgICAgIH0pO1xyXG59XHJcbnJvdXRlUHJvdmlkZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29uZmlnKHJvdXRlUHJvdmlkZXIpO1xyXG4iLCJjb25zdCBzaWRlTmF2ID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vc2lkZS1uYXYvc2lkZS1uYXYuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBTaWRlTmF2Q29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3NpZGVOYXYnLCBzaWRlTmF2KTtcclxuIiwiZnVuY3Rpb24gU2lkZU5hdkNvbnRyb2xsZXIoV2hlYXRoZXJTZXJ2aWNlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBleGlzdGluZ0RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3aGVhdGhlcicpKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhleGlzdGluZ0RhdGEpO1xyXG5cclxuICAgIGlmIChleGlzdGluZ0RhdGEpIHtcclxuICAgICAgICBjdHJsLndoZWF0aGVyRGF0YSA9IGV4aXN0aW5nRGF0YTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgV2hlYXRoZXJTZXJ2aWNlLmdldFdoZWF0aGVyRGV0YWlscygpXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGN0cmwud2hlYXRoZXJEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3doZWF0aGVyJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2hlYXRoZXIgQVBJIEVycm9yIDogXCIsIGVycik7XHJcbiAgICAgICAgICAgIGN0cmwuZXJyb3JNZXNzYWdlID0gZXJyO1xyXG4gICAgICAgIH0pXHJcbn1cclxuXHJcblNpZGVOYXZDb250cm9sbGVyLiRpbmplY3QgPSBbJ1doZWF0aGVyU2VydmljZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb250cm9sbGVyKCdTaWRlTmF2Q29udHJvbGxlcicsIFNpZGVOYXZDb250cm9sbGVyKTsiLCJmdW5jdGlvbiBjb252ZXJ0S2VsdmluVG9DZWxzaXVzKGtlbHZpbikge1xyXG4gICAgaWYgKGtlbHZpbiA8ICgwKSkge1xyXG4gICAgICAgIHJldHVybiAnYmVsb3cgYWJzb2x1dGUgemVybyAoMCBLKSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb252ZXJ0ZWRUZW1wID0gKGtlbHZpbiAtIDI3My4xNSk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoY29udmVydGVkVGVtcCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnZlcnRUaW1lKHRpbWVzdGFtcCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApO1xyXG4gICAgY29uc3QgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICBjb25zdCBtaW51dGVzID0gXCIwXCIgKyBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgIGNvbnN0IHNlY29uZHMgPSBcIjBcIiArIGRhdGUuZ2V0U2Vjb25kcygpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSBob3VycyArICc6JyArIG1pbnV0ZXMuc3Vic3RyKC0yKSArICc6JyArIHNlY29uZHMuc3Vic3RyKC0yKTtcclxuICAgIHJldHVybiBmb3JtYXR0ZWRUaW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBXaGVhdGhlclNlcnZpY2UoJGh0dHAsICRxKSB7XHJcbiAgICB0aGlzLmdldFdoZWF0aGVyRGV0YWlscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICRodHRwKHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT1wdW5lLGluJmFwcGlkPTBhNDMyNDkwZTdlYTc1YTNjODVmNTk1MDY0MGQyNTZkJyB9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2UgLS1cIiwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gXCJXaGVhdGhlciByZXNwb25zZSBpcyBub3QgaW4gMjAwIHN0YXR1cyBjb2RlLiBQbGVhc2UgdHJ5IGFnYWluIGFmdGVyIHNvbWUgdGltZS5cIlxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgd2hlYXRoZXJEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNpdHk6IHJlc3BvbnNlRGF0YS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiAnTWFoYXJhc2h0cmEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50cnk6ICdJbmRpYScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcDogY29udmVydEtlbHZpblRvQ2Vsc2l1cyhyZXNwb25zZURhdGEubWFpbi50ZW1wKSxcclxuICAgICAgICAgICAgICAgICAgICBzdW5yaXNlOiBjb252ZXJ0VGltZShyZXNwb25zZURhdGEuc3lzLnN1bnJpc2UpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1bnNldDogY29udmVydFRpbWUocmVzcG9uc2VEYXRhLnN5cy5zdW5zZXQpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3VkU3RhdGU6IHJlc3BvbnNlRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2hlYXRoZXJEYXRhIC0tXCIsIHdoZWF0aGVyRGF0YSlcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHdoZWF0aGVyRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5XaGVhdGhlclNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290Jykuc2VydmljZSgnV2hlYXRoZXJTZXJ2aWNlJywgV2hlYXRoZXJTZXJ2aWNlKTtcclxuXHJcbiIsImFuZ3VsYXIubW9kdWxlKCdhdXRoZW50aWNhdGlvbicsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnbWNvJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCd1c2VyJywgW10pOyIsImNvbnN0IGRhc2hib2FyZCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWluZGV4Lmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogRGFzaGJvYXJkQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ2Rhc2hib2FyZCcsIGRhc2hib2FyZCk7IiwiZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciBjdHJsID0gdGhpcztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcikiLCJhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJywgW10pOyIsIlxyXG5jb25zdCB0b3BOYXZMb2dpbiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dpbi90b3AtbmF2LWxvZ2luLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogVG9wTmF2TG9naW5Db250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB1c2VyOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29tcG9uZW50KCd0b3BOYXZMb2dpbicsIHRvcE5hdkxvZ2luKTsiLCJmdW5jdGlvbiBUb3BOYXZMb2dpbkNvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIGNvbnN0IHVzZXJSZXNwb25zZSA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkFuaWwgVmlzaHZrYXJtYVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiYW5pbC52aXNodmthcm1hQGpjaS5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiSm9obnNvbiBDb250cm9scyBJbmRpYSBQdnQuIEx0ZC5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiQWtzaGF5IFNvbmlcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImFrc2hheS5zb25pQGdtYWlsLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3NTM2MzI3MjdcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiSW1wZXR1cyBMaW1pdGVkXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIlN1bmlsIFNvbmlcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcInN1bmlsLnNvbmlAYmFyY2xheXMuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkJhcmNsYXlzIFRlY2hub2xvZ3lcIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiRGVlcGFrIEFoaXJ3YWxcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImRlZXBhay5haGlyd2FsQGNnLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJDb2duaXplbnQgVGVjaG5vbG9neS5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiUGl5dXNoIFZpamF5dmFyZ2l5YVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwicGl5dXNoLnZneUB0ZWNobS5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiVGVjaCBNYWhpbmRyYVwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJFbHlzZSBIb2Jzb25cIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImVseXNlQGpjaS5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiSm9obnNvbiBDb250cm9scyBJbmMuXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwiZmVtYWxlXCJcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycycsIEpTT04uc3RyaW5naWZ5KHVzZXJSZXNwb25zZSkpO1xyXG5cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJyb290XCIpLmNvbnRyb2xsZXIoXCJUb3BOYXZMb2dpbkNvbnRyb2xsZXJcIiwgVG9wTmF2TG9naW5Db250cm9sbGVyKTsiLCJjb25zdCBhY3Rpb25UYWJsZSA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlL2FjdGlvbi10YWJsZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IEFjdGlvblRhYmxlQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbXBvbmVudCgnYWN0aW9uVGFibGUnLCBhY3Rpb25UYWJsZSk7XHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG5cclxuICAgIGN0cmwubWNvT2JqZWN0RGV0YWlscyA9IHtcclxuICAgICAgICBzdGF0ZXNUZXh0OiAnU3RhdGVzJyxcclxuICAgICAgICBub09mU3RhdGVzOiA0LFxyXG4gICAgICAgIHJlbGlucXVpc2hEZWZhdWx0OiAnU3RhdGUgMCdcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNob3dDb2xsYXBzaWJsZUFjdGlvblRhYmxlID0gdHJ1ZTtcclxuICAgICRzY29wZS5zaG93Tm9ybWFsQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuXHJcbiAgICBjdHJsLnNob3dDb2xsYXBzaWJsZVRhYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5zaG93Q29sbGFwc2libGVBY3Rpb25UYWJsZSA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLnNob3dOb3JtYWxBY3Rpb25UYWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwuc2hvd05vcm1hbFRhYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5zaG93Tm9ybWFsQWN0aW9uVGFibGUgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5zaG93Q29sbGFwc2libGVBY3Rpb25UYWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGN0cmwubWNvU3RhdGVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhdGVOYW1lOiAnU3RhdGUgMTAnLFxyXG4gICAgICAgICAgICBzdGF0dXM6IHRydWUsXHJcbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjAxJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnT24nLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWMDEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdPZmYnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhdGVOYW1lOiAnU3RhdGUgMjAnLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYxMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0Nvb2xpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjIwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnSGVhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhdGVOYW1lOiAnU3RhdGUgMzAnLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYxMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0Nvb2xpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjIwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnSGVhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjMwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnQ29vbGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWNDAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdIZWF0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWNTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlY2MCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDQwJyxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYyMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XHJcblxyXG5BY3Rpb25UYWJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29udHJvbGxlcignQWN0aW9uVGFibGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVDb250cm9sbGVyKTtcclxuIiwiY29uc3QgbG9naW4gPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4vbG9naW4uaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBMb2dpbkNvbnRyb2xsZXJcclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhdXRoZW50aWNhdGlvbicpLmNvbXBvbmVudCgnbG9naW4nLCBsb2dpbik7XHJcbiIsImZ1bmN0aW9uIExvZ2luQ29udHJvbGxlcigkbG9jYXRpb24pIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3doZWF0aGVyJyk7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9ICdhbmlsJztcclxuICAgIGNvbnN0IHBhc3N3b3JkID0gJ0luZGlhQDEyMyc7XHJcbiAgICBsZXQgaXNMb2dpbkZhaWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGN0cmwubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICBpZiAoY3JlZGVudGlhbHMgJiYgY3JlZGVudGlhbHMudXNlcm5hbWUgPT09IHVzZXJuYW1lICYmIGNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSBwYXNzd29yZCkge1xyXG4gICAgICAgICAgICBpc0xvZ2luRmFpbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dpbicsIHRydWUpO1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Rhc2hib2FyZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpc0xvZ2luRmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICBjdHJsLmxvZ2luU3RhdHVzID0gaXNMb2dpbkZhaWxlZDtcclxuICAgICAgICBjdHJsLmxvZ2luRXJyb3JNZXNzYWdlID0gJ0ludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQhJztcclxuICAgIH1cclxufVxyXG5cclxuTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTsiLCJjb25zdCBhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBpdGVtczogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUnLCBhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUpO1xyXG5cclxuIiwiZnVuY3Rpb24gQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuJG9uSW5pdCA9ICgpID0+IHtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWN0aW9uIFRhYmxlIEl0ZW1zID1cIiwgY3RybC5pdGVtcyk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5pc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGN0cmwudG9nZ2xlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuaXNFeHBhbmRlZCA9ICEoJHNjb3BlLmlzRXhwYW5kZWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVG9nZ2xlIERhdGEgQ2xpY2tlZCAhIS0tXCIsICRzY29wZS5pc0V4cGFuZGVkKVxyXG4gICAgfVxyXG59XHJcblxyXG5BY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXInLCBBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyKTtcclxuIiwiY29uc3QgYWN0aW9uVGFibGVJdGVtc05vcm1hbCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIGl0ZW1zOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlSXRlbXNOb3JtYWwnLCBhY3Rpb25UYWJsZUl0ZW1zTm9ybWFsKTtcclxuXHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICB0aGlzLiRvbkluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFjdGlvbiBUYWJsZSBJdGVtcyA9XCIsIGN0cmwuaXRlbXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICBjdHJsLnRvZ2dsZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmlzRXhwYW5kZWQgPSAhKCRzY29wZS5pc0V4cGFuZGVkKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRvZ2dsZSBEYXRhIENsaWNrZWQgISEtLVwiLCAkc2NvcGUuaXNFeHBhbmRlZClcclxuICAgIH1cclxufVxyXG5cclxuQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29udHJvbGxlcignQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXInLCBBY3Rpb25UYWJsZUl0ZW1zTm9ybWFsQ29udHJvbGxlcik7XHJcbiIsImNvbnN0IHVzZXJOZXcgPSB7XHJcbiAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3VzZXIvdXNlci1uZXcvdXNlci1uZXcuaHRtbCcsXHJcbiAgY29udHJvbGxlcjogVXNlck5ld0NvbnRyb2xsZXIsXHJcbiAgYmluZGluZ3M6IHtcclxuICAgIHVzZXI6ICc8J1xyXG4gIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb21wb25lbnQoJ3VzZXJOZXcnLCB1c2VyTmV3KTtcclxuIiwiZnVuY3Rpb24gVXNlck5ld0NvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIGN0cmwudXNlciA9IHt9O1xyXG5cclxuICAgIGN0cmwubmV3VXNlciA9IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ05ldyBVc2VyIFN1Ym1pdHRlZDonLCB1c2VyKTtcclxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXIuZmlyc3ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1VzZXIgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGAke3VzZXIuZmlyc3ROYW1lfSAke3VzZXIubGFzdE5hbWV9YCxcclxuICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIG1vYmlsZTogdXNlci5tb2JpbGUsXHJcbiAgICAgICAgICAgIGNvbXBhbnk6IHVzZXIuY29tcGFueSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB1c2VyLmdlbmRlclxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nVXNlcnMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKTtcclxuXHJcbiAgICAgICAgaWYgKGV4aXN0aW5nVXNlcnMgJiYgZXhpc3RpbmdVc2Vycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGV4aXN0aW5nVXNlcnMucHVzaChuZXdVc2VyKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkoZXhpc3RpbmdVc2VycykpO1xyXG4gICAgICAgICAgICBjdHJsLnVzZXIgPSB7fTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29udHJvbGxlcignVXNlck5ld0NvbnRyb2xsZXInLCBVc2VyTmV3Q29udHJvbGxlcik7XHJcbiIsImNvbnN0IHRvcE5hdkxvZ291dCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dvdXRDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgndG9wTmF2TG9nb3V0JywgdG9wTmF2TG9nb3V0KTsiLCJmdW5jdGlvbiBUb3BOYXZMb2dvdXRDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbn1cclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInJvb3RcIikuY29udHJvbGxlcihcIlRvcE5hdkxvZ291dENvbnRyb2xsZXJcIiwgVG9wTmF2TG9nb3V0Q29udHJvbGxlcik7IiwiY29uc3QgdXNlcnMgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFVzZXJzQ29udHJvbGxlcixcclxuICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgdXNlcnM6ICc8JyxcclxuICAgICAgICBlZGl0VXNlcjogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbXBvbmVudCgndXNlcnMnLCB1c2Vycyk7XHJcbiIsImZ1bmN0aW9uIFVzZXJzQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgdXNlcnMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKTtcclxuICAgIGN0cmwudXNlcnMgPSB1c2VycztcclxuXHJcbiAgICBjdHJsLmVkaXRVc2VyID0gZnVuY3Rpb24odXNlclNlbGVjdGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codXNlclNlbGVjdGVkKTtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb250cm9sbGVyKCdVc2Vyc0NvbnRyb2xsZXInLCBVc2Vyc0NvbnRyb2xsZXIpOyIsImNvbnN0IGRhc2hib2FyZENhcmRzID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQtY2FyZHMvZGFzaGJvYXJkLWNhcmRzLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB1c2VyczogJzwnXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb21wb25lbnQoJ2Rhc2hib2FyZENhcmRzJywgZGFzaGJvYXJkQ2FyZHMpO1xyXG4iLCJmdW5jdGlvbiBEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKVxyXG5cclxuICAgIGlmIChwYXlsb2FkICYmIHBheWxvYWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGN0cmwudXNlcnMgPSBwYXlsb2FkO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZENhcmRzQ29udHJvbGxlcicsIERhc2hib2FyZENhcmRzQ29udHJvbGxlcik7Il19
