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

function SideNavController(WeatherService) {
    const ctrl = this;

    const existingData = JSON.parse(localStorage.getItem('weather'));

    console.log(existingData);

    if (existingData) {
        ctrl.weatherData = existingData;
        return;
    }

    WeatherService.getWeatherDetails()
        .then(data => {
            ctrl.weatherData = data;
            localStorage.setItem('weather', JSON.stringify(data));
        }).catch(err => {
            console.log("Weather API Error : ", err);
            ctrl.errorMessage = err;
        })
}

SideNavController.$inject = ['WeatherService'];

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

function WeatherService($http, $q) {
    this.getWeatherDetails = function () {
        const deferred = $q.defer();

        $http({ method: 'GET', url: 'https://api.openweathermap.org/data/2.5/weather?q=pune,in&appid=0a432490e7ea75a3c85f5950640d256d' })
            .then(function (response) {
                if (response.status !== 200) {
                    const errorMessage = "Weather response is not in 200 status code. Please try again after some time."
                    deferred.resolve(errorMessage);
                    return;
                }

                const responseData = response.data;

                let weatherData = {
                    city: responseData.name,
                    state: 'Maharashtra',
                    country: 'India',
                    temp: convertKelvinToCelsius(responseData.main.temp),
                    sunrise: convertTime(responseData.sys.sunrise),
                    sunset: convertTime(responseData.sys.sunset),
                    cloudState: responseData.weather[0].description
                };

                deferred.resolve(weatherData);
            }, function (err) {
                console.log(err);
                deferred.reject(err);
            });

        return deferred.promise;
    }
}

WeatherService.$inject = ['$http', '$q'];

angular.module('root').service('WeatherService', WeatherService);

angular.module('authentication', []);
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
angular.module('mco', []);

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

const login = {
    templateUrl: './app/components/authentication/login/login.html',
    controller: LoginController
};

angular.module('authentication').component('login', login);

function LoginController($location) {
    const ctrl = this;
    localStorage.removeItem('weather');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAucm91dGVzLmpzIiwiY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2LmNvbXBvbmVudC5qcyIsImNvbW1vbi9zaWRlLW5hdi9zaWRlLW5hdi5jb250cm9sbGVyLmpzIiwiY29tbW9uL3NpZGUtbmF2L3dlYXRoZXIuc2VydmljZS5qcyIsImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vYXV0aGVudGljYXRpb24ubW9kdWxlLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXIubW9kdWxlLmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWluZGV4LmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1pbmRleC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvbWNvL21jby5tb2R1bGUuanMiLCJjb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ2luL3RvcC1uYXYtbG9naW4uY29tcG9uZW50LmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dpbi90b3AtbmF2LWxvZ2luLmNvbnRyb2xsZXIuanMiLCJjb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ291dC90b3AtbmF2LWxvZ291dC5jb21wb25lbnQuanMiLCJjb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ291dC90b3AtbmF2LWxvZ291dC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXItbmV3L3VzZXItbmV3LmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQtY2FyZHMvZGFzaGJvYXJkLWNhcmRzLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUvYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwvYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4vbG9naW4uY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlL2FjdGlvbi10YWJsZS5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3Jvb3QnLCBbXHJcbiAgICAnbmdSb3V0ZScsXHJcbiAgICAnZGFzaGJvYXJkJyxcclxuICAgICd1c2VyJyxcclxuICAgICdhdXRoZW50aWNhdGlvbicsXHJcbiAgICAnbWNvJ1xyXG5dKTtcclxuXHJcbiIsImZ1bmN0aW9uIHJvdXRlUHJvdmlkZXIoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxvZ2luPjwvbG9naW4+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy91c2VyL25ldycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8dXNlci1uZXc+PC91c2VyLW5ldz4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3VzZXJzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzx1c2Vycz48L3VzZXJzPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvZGFzaGJvYXJkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkYXNoYm9hcmQ+PC9kYXNoYm9hcmQ+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9sb2dvdXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxvZ2luPjwvbG9naW4+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9hY3Rpb24tdGFibGUnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGFjdGlvbi10YWJsZT48L2FjdGlvbi10YWJsZT4nXHJcbiAgICAgICAgfSk7XHJcbn1cclxucm91dGVQcm92aWRlci4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlciddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb25maWcocm91dGVQcm92aWRlcik7XHJcbiIsImNvbnN0IHNpZGVOYXYgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbW1vbi9zaWRlLW5hdi9zaWRlLW5hdi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFNpZGVOYXZDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgnc2lkZU5hdicsIHNpZGVOYXYpO1xyXG4iLCJmdW5jdGlvbiBTaWRlTmF2Q29udHJvbGxlcihXZWF0aGVyU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgY29uc3QgZXhpc3RpbmdEYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2VhdGhlcicpKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhleGlzdGluZ0RhdGEpO1xyXG5cclxuICAgIGlmIChleGlzdGluZ0RhdGEpIHtcclxuICAgICAgICBjdHJsLndlYXRoZXJEYXRhID0gZXhpc3RpbmdEYXRhO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBXZWF0aGVyU2VydmljZS5nZXRXZWF0aGVyRGV0YWlscygpXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGN0cmwud2VhdGhlckRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd2VhdGhlcicsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldlYXRoZXIgQVBJIEVycm9yIDogXCIsIGVycik7XHJcbiAgICAgICAgICAgIGN0cmwuZXJyb3JNZXNzYWdlID0gZXJyO1xyXG4gICAgICAgIH0pXHJcbn1cclxuXHJcblNpZGVOYXZDb250cm9sbGVyLiRpbmplY3QgPSBbJ1dlYXRoZXJTZXJ2aWNlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbnRyb2xsZXIoJ1NpZGVOYXZDb250cm9sbGVyJywgU2lkZU5hdkNvbnRyb2xsZXIpOyIsImZ1bmN0aW9uIGNvbnZlcnRLZWx2aW5Ub0NlbHNpdXMoa2VsdmluKSB7XHJcbiAgICBpZiAoa2VsdmluIDwgKDApKSB7XHJcbiAgICAgICAgcmV0dXJuICdiZWxvdyBhYnNvbHV0ZSB6ZXJvICgwIEspJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvbnZlcnRlZFRlbXAgPSAoa2VsdmluIC0gMjczLjE1KTtcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChjb252ZXJ0ZWRUZW1wKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29udmVydFRpbWUodGltZXN0YW1wKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGltZXN0YW1wICogMTAwMCk7XHJcbiAgICBjb25zdCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBcIjBcIiArIGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgY29uc3Qgc2Vjb25kcyA9IFwiMFwiICsgZGF0ZS5nZXRTZWNvbmRzKCk7XHJcblxyXG4gICAgY29uc3QgZm9ybWF0dGVkVGltZSA9IGhvdXJzICsgJzonICsgbWludXRlcy5zdWJzdHIoLTIpICsgJzonICsgc2Vjb25kcy5zdWJzdHIoLTIpO1xyXG4gICAgcmV0dXJuIGZvcm1hdHRlZFRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdlYXRoZXJTZXJ2aWNlKCRodHRwLCAkcSkge1xyXG4gICAgdGhpcy5nZXRXZWF0aGVyRGV0YWlscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblxyXG4gICAgICAgICRodHRwKHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT1wdW5lLGluJmFwcGlkPTBhNDMyNDkwZTdlYTc1YTNjODVmNTk1MDY0MGQyNTZkJyB9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IFwiV2VhdGhlciByZXNwb25zZSBpcyBub3QgaW4gMjAwIHN0YXR1cyBjb2RlLiBQbGVhc2UgdHJ5IGFnYWluIGFmdGVyIHNvbWUgdGltZS5cIlxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgd2VhdGhlckRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2l0eTogcmVzcG9uc2VEYXRhLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6ICdNYWhhcmFzaHRyYScsXHJcbiAgICAgICAgICAgICAgICAgICAgY291bnRyeTogJ0luZGlhJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wOiBjb252ZXJ0S2VsdmluVG9DZWxzaXVzKHJlc3BvbnNlRGF0YS5tYWluLnRlbXApLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1bnJpc2U6IGNvbnZlcnRUaW1lKHJlc3BvbnNlRGF0YS5zeXMuc3VucmlzZSksXHJcbiAgICAgICAgICAgICAgICAgICAgc3Vuc2V0OiBjb252ZXJ0VGltZShyZXNwb25zZURhdGEuc3lzLnN1bnNldCksXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvdWRTdGF0ZTogcmVzcG9uc2VEYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh3ZWF0aGVyRGF0YSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5XZWF0aGVyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5zZXJ2aWNlKCdXZWF0aGVyU2VydmljZScsIFdlYXRoZXJTZXJ2aWNlKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCd1c2VyJywgW10pOyIsImNvbnN0IGRhc2hib2FyZCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWluZGV4Lmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogRGFzaGJvYXJkQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ2Rhc2hib2FyZCcsIGRhc2hib2FyZCk7IiwiZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigpIHtcclxuICAgIHZhciBjdHJsID0gdGhpcztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcikiLCJhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdtY28nLCBbXSk7IiwiXHJcbmNvbnN0IHRvcE5hdkxvZ2luID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ2luL3RvcC1uYXYtbG9naW4uaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dpbkNvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIHVzZXI6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3RvcE5hdkxvZ2luJywgdG9wTmF2TG9naW4pOyIsImZ1bmN0aW9uIFRvcE5hdkxvZ2luQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgdXNlclJlc3BvbnNlID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiQW5pbCBWaXNodmthcm1hXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJhbmlsLnZpc2h2a2FybWFAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluZGlhIFB2dC4gTHRkLlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJBa3NoYXkgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiYWtzaGF5LnNvbmlAZ21haWwuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTc1MzYzMjcyN1wiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJJbXBldHVzIExpbWl0ZWRcIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VuaWwgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwic3VuaWwuc29uaUBiYXJjbGF5cy5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiQmFyY2xheXMgVGVjaG5vbG9neVwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJEZWVwYWsgQWhpcndhbFwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZGVlcGFrLmFoaXJ3YWxAY2cuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkNvZ25pemVudCBUZWNobm9sb2d5LlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJQaXl1c2ggVmlqYXl2YXJnaXlhXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJwaXl1c2gudmd5QHRlY2htLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJUZWNoIE1haGluZHJhXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkVseXNlIEhvYnNvblwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZWx5c2VAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluYy5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJmZW1hbGVcIlxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkodXNlclJlc3BvbnNlKSk7XHJcblxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInJvb3RcIikuY29udHJvbGxlcihcIlRvcE5hdkxvZ2luQ29udHJvbGxlclwiLCBUb3BOYXZMb2dpbkNvbnRyb2xsZXIpOyIsImNvbnN0IHRvcE5hdkxvZ291dCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dvdXRDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgndG9wTmF2TG9nb3V0JywgdG9wTmF2TG9nb3V0KTsiLCJmdW5jdGlvbiBUb3BOYXZMb2dvdXRDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbn1cclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInJvb3RcIikuY29udHJvbGxlcihcIlRvcE5hdkxvZ291dENvbnRyb2xsZXJcIiwgVG9wTmF2TG9nb3V0Q29udHJvbGxlcik7IiwiY29uc3QgdXNlck5ldyA9IHtcclxuICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5odG1sJyxcclxuICBjb250cm9sbGVyOiBVc2VyTmV3Q29udHJvbGxlcixcclxuICBiaW5kaW5nczoge1xyXG4gICAgdXNlcjogJzwnXHJcbiAgfVxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbXBvbmVudCgndXNlck5ldycsIHVzZXJOZXcpO1xyXG4iLCJmdW5jdGlvbiBVc2VyTmV3Q29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY3RybC51c2VyID0ge307XHJcblxyXG4gICAgY3RybC5uZXdVc2VyID0gZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTmV3IFVzZXIgU3VibWl0dGVkOicsIHVzZXIpO1xyXG4gICAgICAgIGlmICghdXNlciB8fCAhdXNlci5maXJzdE5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3VXNlciA9IHtcclxuICAgICAgICAgICAgbmFtZTogYCR7dXNlci5maXJzdE5hbWV9ICR7dXNlci5sYXN0TmFtZX1gLFxyXG4gICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcclxuICAgICAgICAgICAgbW9iaWxlOiB1c2VyLm1vYmlsZSxcclxuICAgICAgICAgICAgY29tcGFueTogdXNlci5jb21wYW55LFxyXG4gICAgICAgICAgICBnZW5kZXI6IHVzZXIuZ2VuZGVyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdVc2VycyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJzJykpO1xyXG5cclxuICAgICAgICBpZiAoZXhpc3RpbmdVc2VycyAmJiBleGlzdGluZ1VzZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZXhpc3RpbmdVc2Vycy5wdXNoKG5ld1VzZXIpO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcnMnLCBKU09OLnN0cmluZ2lmeShleGlzdGluZ1VzZXJzKSk7XHJcbiAgICAgICAgICAgIGN0cmwudXNlciA9IHt9O1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb250cm9sbGVyKCdVc2VyTmV3Q29udHJvbGxlcicsIFVzZXJOZXdDb250cm9sbGVyKTtcclxuIiwiY29uc3QgdXNlcnMgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFVzZXJzQ29udHJvbGxlcixcclxuICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgdXNlcnM6ICc8JyxcclxuICAgICAgICBlZGl0VXNlcjogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbXBvbmVudCgndXNlcnMnLCB1c2Vycyk7XHJcbiIsImZ1bmN0aW9uIFVzZXJzQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgdXNlcnMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKTtcclxuICAgIGN0cmwudXNlcnMgPSB1c2VycztcclxuXHJcbiAgICBjdHJsLmVkaXRVc2VyID0gZnVuY3Rpb24odXNlclNlbGVjdGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codXNlclNlbGVjdGVkKTtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb250cm9sbGVyKCdVc2Vyc0NvbnRyb2xsZXInLCBVc2Vyc0NvbnRyb2xsZXIpOyIsImNvbnN0IGRhc2hib2FyZENhcmRzID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQtY2FyZHMvZGFzaGJvYXJkLWNhcmRzLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB1c2VyczogJzwnXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb21wb25lbnQoJ2Rhc2hib2FyZENhcmRzJywgZGFzaGJvYXJkQ2FyZHMpO1xyXG4iLCJmdW5jdGlvbiBEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKVxyXG5cclxuICAgIGlmIChwYXlsb2FkICYmIHBheWxvYWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGN0cmwudXNlcnMgPSBwYXlsb2FkO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZENhcmRzQ29udHJvbGxlcicsIERhc2hib2FyZENhcmRzQ29udHJvbGxlcik7IiwiY29uc3QgYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUvYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcixcclxuICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgaXRlbXM6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbXBvbmVudCgnYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlJywgYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlKTtcclxuXHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuXHJcbiAgICB0aGlzLiRvbkluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFjdGlvbiBUYWJsZSBJdGVtcyA9XCIsIGN0cmwuaXRlbXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICBjdHJsLnRvZ2dsZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmlzRXhwYW5kZWQgPSAhKCRzY29wZS5pc0V4cGFuZGVkKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRvZ2dsZSBEYXRhIENsaWNrZWQgISEtLVwiLCAkc2NvcGUuaXNFeHBhbmRlZClcclxuICAgIH1cclxufVxyXG5cclxuQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb250cm9sbGVyKCdBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcik7XHJcbiIsImNvbnN0IGFjdGlvblRhYmxlSXRlbXNOb3JtYWwgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwvYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBpdGVtczogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZUl0ZW1zTm9ybWFsJywgYWN0aW9uVGFibGVJdGVtc05vcm1hbCk7XHJcblxyXG4iLCJmdW5jdGlvbiBBY3Rpb25UYWJsZUl0ZW1zTm9ybWFsQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgdGhpcy4kb25Jbml0ID0gKCkgPT4ge1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coXCJBY3Rpb24gVGFibGUgSXRlbXMgPVwiLCBjdHJsLml0ZW1zKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgY3RybC50b2dnbGVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5pc0V4cGFuZGVkID0gISgkc2NvcGUuaXNFeHBhbmRlZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUb2dnbGUgRGF0YSBDbGlja2VkICEhLS1cIiwgJHNjb3BlLmlzRXhwYW5kZWQpXHJcbiAgICB9XHJcbn1cclxuXHJcbkFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCBsb2dpbiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29tcG9uZW50KCdsb2dpbicsIGxvZ2luKTtcclxuIiwiZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRsb2NhdGlvbikge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnd2VhdGhlcicpO1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSAnYW5pbCc7XHJcbiAgICBjb25zdCBwYXNzd29yZCA9ICdJbmRpYUAxMjMnO1xyXG4gICAgbGV0IGlzTG9naW5GYWlsZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjdHJsLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgaWYgKGNyZWRlbnRpYWxzICYmIGNyZWRlbnRpYWxzLnVzZXJuYW1lID09PSB1c2VybmFtZSAmJiBjcmVkZW50aWFscy5wYXNzd29yZCA9PT0gcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgaXNMb2dpbkZhaWxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9naW4nLCB0cnVlKTtcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9kYXNoYm9hcmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNMb2dpbkZhaWxlZCA9IHRydWU7XHJcbiAgICAgICAgY3RybC5sb2dpblN0YXR1cyA9IGlzTG9naW5GYWlsZWQ7XHJcbiAgICAgICAgY3RybC5sb2dpbkVycm9yTWVzc2FnZSA9ICdJbnZhbGlkIHVzZXJuYW1lIG9yIHBhc3N3b3JkISc7XHJcbiAgICB9XHJcbn1cclxuXHJcbkxvZ2luQ29udHJvbGxlci4kaW5qZWN0ID0gWyckbG9jYXRpb24nXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhdXRoZW50aWNhdGlvbicpLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7IiwiY29uc3QgYWN0aW9uVGFibGUgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS9hY3Rpb24tdGFibGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBBY3Rpb25UYWJsZUNvbnRyb2xsZXJcclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlJywgYWN0aW9uVGFibGUpO1xyXG4iLCJmdW5jdGlvbiBBY3Rpb25UYWJsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuXHJcbiAgICBjdHJsLm1jb09iamVjdERldGFpbHMgPSB7XHJcbiAgICAgICAgc3RhdGVzVGV4dDogJ1N0YXRlcycsXHJcbiAgICAgICAgbm9PZlN0YXRlczogNCxcclxuICAgICAgICByZWxpbnF1aXNoRGVmYXVsdDogJ1N0YXRlIDAnXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zaG93Q29sbGFwc2libGVBY3Rpb25UYWJsZSA9IHRydWU7XHJcbiAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gZmFsc2U7XHJcblxyXG4gICAgY3RybC5zaG93Q29sbGFwc2libGVUYWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5zaG93Tm9ybWFsQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLnNob3dOb3JtYWxUYWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLm1jb1N0YXRlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDEwJyxcclxuICAgICAgICAgICAgc3RhdHVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYwMScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ09uJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjAxJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnT2ZmJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDIwJyxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYyMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDMwJyxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYyMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYzMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0Nvb2xpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzEwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjQwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnSGVhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjUwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnQ29vbGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWNjAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdIZWF0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGF0ZU5hbWU6ICdTdGF0ZSA0MCcsXHJcbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjEwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnQ29vbGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWMjAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdIZWF0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF1cclxufVxyXG5cclxuQWN0aW9uVGFibGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlQ29udHJvbGxlcicsIEFjdGlvblRhYmxlQ29udHJvbGxlcik7XHJcbiJdfQ==
