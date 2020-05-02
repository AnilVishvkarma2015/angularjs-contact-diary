angular.module('root', [
    'ngRoute',
    'dashboard',
    'user',
    'authentication',
    'mco',
    'weather'
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
            template: '<dashboard-cards></dashboard-cards>'
        })
        .when('/logout', {
            template: '<login></login>'
        })
        .when('/action-table', {
            template: '<action-table></action-table>'
        })
        .when('/weather', {
            template: '<weather-dashboard></weather-dashboard>'
        });
}
routeProvider.$inject = ['$routeProvider'];

angular.module('root').config(routeProvider);

const footerComponent = {
    templateUrl : './app/common/footer/footer.html',
    controller: SideNavController
}

angular.module('root').component('footerComponent', footerComponent);

const sideNav = {
    templateUrl: './app/common/side-nav/side-nav.html',
    controller: SideNavController
};

angular.module('root').component('sideNav', sideNav);

function SideNavController() {
    const ctrl = this;
}

angular.module('root').controller('SideNavController', SideNavController);

angular.module('authentication', []);
angular.module('mco', []);
angular.module('user', []);
angular.module('dashboard', []);
function DashboardService() {
    this.defaultContacts = [
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
            "name": "Elyse Hobson",
            "email": "elyse.hobson@barclays.com",
            "mobile": "971344864",
            "company": "Barclays Technology",
            "gender": "female"
        },
        {
            "name": "Deepak Ahirwal",
            "email": "deepak.ahirwal@cg.com",
            "mobile": "971344864",
            "company": "Cognizent Technology.",
            "gender": "male"
        }
    ];

    this.getDefaultContacts = function () {
        return this.defaultContacts;
    }

    this.setDefaultContacts = function (newContact) {
        this.defaultContacts.push(newContact);
    }
}

angular.module('root').service('DashboardService', DashboardService);

angular.module('weather', []);

const topNavLogin = {
    templateUrl: './app/common/top-nav/top-nav-login/top-nav-login.html',
    controller: TopNavLoginController
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
   
    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
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

    $scope.isExpanded = false;
    
    ctrl.toggleData = function () {
        $scope.isExpanded = !($scope.isExpanded);
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

        DashboardService.setDefaultContacts(newUser);
        ctrl.user = {};
    }
}

UserNewController.$inject = ['DashboardService'];

angular.module('user').controller('UserNewController', UserNewController);

const users = {
    templateUrl: './app/components/user/users/users.html',
    controller: UsersController
};

angular.module('user').component('users', users);

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

const dashboardCards = {
    templateUrl: './app/components/dashboard/dashboard-cards/dashboard-cards.html',
    controller: DashboardCardsController
}

angular.module('dashboard').component('dashboardCards', dashboardCards);

function DashboardCardsController(DashboardService) {
    const ctrl = this;
    ctrl.users = DashboardService.getDefaultContacts();
}

DashboardCardsController.$inject = ['DashboardService']

angular.module('dashboard').controller('DashboardCardsController', DashboardCardsController);
const weatherDashboard = {
    templateUrl: './app/components/weather/weather-dashboard/weather-dashboard.html',
    controller: WeatherDashboardController
};

angular.module('weather').component('weatherDashboard', weatherDashboard);


function WeatherDashboardController($scope, CurrentWeatherService, CommonWeatherService) {
    const ctrl = this;
    $scope.citySelected = '';
    $scope.isLoading = true;

    function getCityWheather() {
        const cityName = CommonWeatherService.getWeatherCityName();
        return CurrentWeatherService.getWeatherDetails(cityName).then(currentWeatherResponse => {
            ctrl.wheatherResponse = currentWeatherResponse;
            $scope.isLoading = false;
        }).catch(err => {
            ctrl.wheatherResponse = err;
            $scope.isLoading = false;
        });
    }

    ctrl.getWeatherForCitySelected = function () {
        CommonWeatherService.setWeatherCityName($scope.citySelected);
        $scope.isLoading = true;
        return getCityWheather();
    }

    getCityWheather();
}

WeatherDashboardController.$inject = ['$scope', 'CurrentWeatherService', 'CommonWeatherService'];

angular.module('weather').controller('WeatherDashboardController', WeatherDashboardController);

function CommonWeatherService() {
    this.cityToUse = 'Pune';

    this.setWeatherCityName = function (cityName) {
        this.cityToUse = cityName;
    }

    this.getWeatherCityName = function () {
        return this.cityToUse;
    }
}

angular.module('weather').service('CommonWeatherService', CommonWeatherService);
function handleErrorResponse(statusCode) {
    let errorResponse = {};

    switch (statusCode) {
        case 200:
            errorResponse.isError = false;
            errorResponse.errorMessage = null;
            break;

        case 400:
            errorResponse.isError = true;
            errorResponse.errorMessage = 'You have provided invalid input. Please enter valid city name to search!!';
            break;

        case 404:
            errorResponse.isError = true;
            errorResponse.errorMessage = 'This city does not exist!';
            break;

        case 500:
            errorResponse.isError = true;
            errorResponse.errorMessage = 'Internal Server Error';
            break;

        default:
            break;
    }

    return errorResponse;
}

function handleResponse(response) {
    if (!response) {
        const errorResponse = {
            isError: true,
            errorMessage: "Weather response is not responding. Please try again after some time."
        };

        return errorResponse;
    }

    return handleErrorResponse(response.status);
}

function prepareWeatherResponse(responseData) {
    const currentWeatherData = {
        isError: false,
        city: responseData.location.name,
        state: responseData.location.region,
        country: responseData.location.country,
        localTime: responseData.location.localtime,
        temp_c: Math.round(responseData.current.temp_c),
        temp_f: Math.round(responseData.current.temp_f),
        feelslike_c: responseData.current.feelslike_c,
        humidity: responseData.current.humidity,
        pressure: responseData.current.pressure_mb,
        cloud_state: responseData.current.condition.text,
        cloud_icon: responseData.current.condition.icon
    };

    return currentWeatherData;
}

function CurrentWeatherService($http, $q) {
    this.getWeatherDetails = function (city) {
        const deferred = $q.defer();
        const weather_api = `https://api.weatherapi.com/v1/current.json?key=f29ec216fe0f4e4da5f65632203004&q=${city}`;

        $http({ method: 'GET', url: weather_api })
            .then(function (response) {
                const responseStatus = handleResponse(response);

                if (responseStatus.isError) {
                    deferred.resolve(responseStatus);
                    return;
                }

                deferred.resolve(prepareWeatherResponse(response.data));
            }, function (err) {
                const errorMessage = {
                    isError: true,
                    errorMessage: err.data.error.message
                };

                deferred.reject(errorMessage);
            });

        return deferred.promise;
    }
}

CurrentWeatherService.$inject = ['$http', '$q'];

angular.module('root').service('CurrentWeatherService', CurrentWeatherService);

function prepareWeatherForecastResponse(responseData) {
    const forecastDays = responseData.forecast.forecastday;
    const forecastList = [];

    forecastDays.forEach(element => {
        let forecastData = {
            temp_high: element.day.maxtemp_c,
            temp_low: element.day.mintemp_c,
            cloud_icon: element.day.condition.icon,
            date_month: element.date,
            cloud_state: element.day.condition.text
        };

        forecastList.push(forecastData);
    })

    return forecastList;
}

function ForecastWeatherService($http, $q) {
    this.getWeatherForecast = function (city) {
        const deferred = $q.defer();
        const weather_api = `https://api.weatherapi.com/v1/forecast.json?key=f29ec216fe0f4e4da5f65632203004&q=${city}&days=3`;

        $http({ method: 'GET', url: weather_api })
            .then(function (response) {
                if (response.status !== 200) {
                    const errorResponse = {
                        isError: true,
                        errorMessage: "Weather response is not responding. Please try again after some time."
                    };

                    deferred.resolve(errorResponse);
                    return;
                }

                deferred.resolve(prepareWeatherForecastResponse(response.data));
            }, function (err) {
                const errorMessage = {
                    isError: true,
                    errorMessage: err.data.error.message
                };

                deferred.reject(errorMessage);
            });

        return deferred.promise;
    }
}

ForecastWeatherService.$inject = ['$http', '$q'];

angular.module('root').service('ForecastWeatherService', ForecastWeatherService);
const weatherForecast = {
    templateUrl: './app/components/weather/weather-forecast/weather-forecast.html',
    controller: WeatherForecastController
};

angular.module('weather').component('weatherForecast', weatherForecast);

function WeatherForecastController($scope, ForecastWeatherService, CommonWeatherService) {
    var ctrl = this;

    function getforecastWeather() {
        const cityName = CommonWeatherService.getWeatherCityName();
        return ForecastWeatherService.getWeatherForecast(cityName).then(forecastResponse => {
            ctrl.forecastDetails = forecastResponse;
        }).catch(err => {
            ctrl.forecastDetails = forecastResponse;
        })
    }

    getforecastWeather();
}

WeatherForecastController.$inject = ['$scope', 'ForecastWeatherService', 'CommonWeatherService'];

angular.module('weather').controller('WeatherForecastController', WeatherForecastController);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAucm91dGVzLmpzIiwiY29tbW9uL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LmpzIiwiY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2LmNvbXBvbmVudC5qcyIsImNvbW1vbi9zaWRlLW5hdi9zaWRlLW5hdi5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9hdXRoZW50aWNhdGlvbi5tb2R1bGUuanMiLCJjb21wb25lbnRzL21jby9tY28ubW9kdWxlLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXIubW9kdWxlLmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXIubW9kdWxlLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dpbi90b3AtbmF2LWxvZ2luLmNvbXBvbmVudC5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5jb250cm9sbGVyLmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29tcG9uZW50LmpzIiwiY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4vbG9naW4uY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlL2FjdGlvbi10YWJsZS5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUvYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlci1uZXcvdXNlci1uZXcuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlcnMvdXNlcnMuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItZGFzaGJvYXJkL3dlYXRoZXItZGFzaGJvYXJkLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLWRhc2hib2FyZC93ZWF0aGVyLWRhc2hib2FyZC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItc2VydmljZXMvY29tbW9uLXdlYXRoZXIuc2VydmljZS5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLXNlcnZpY2VzL2N1cnJlbnQtd2VhdGhlci5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItc2VydmljZXMvZm9yZWNhc3Qtd2VhdGhlci5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItZm9yZWNhc3Qvd2VhdGhlci1mb3JlY2FzdC5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL3dlYXRoZXIvd2VhdGhlci1mb3JlY2FzdC93ZWF0aGVyLWZvcmVjYXN0LmNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUNBQTtBQ0FBO0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3Jvb3QnLCBbXHJcbiAgICAnbmdSb3V0ZScsXHJcbiAgICAnZGFzaGJvYXJkJyxcclxuICAgICd1c2VyJyxcclxuICAgICdhdXRoZW50aWNhdGlvbicsXHJcbiAgICAnbWNvJyxcclxuICAgICd3ZWF0aGVyJ1xyXG5dKTtcclxuXHJcbiIsImZ1bmN0aW9uIHJvdXRlUHJvdmlkZXIoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxvZ2luPjwvbG9naW4+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy91c2VyL25ldycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8dXNlci1uZXc+PC91c2VyLW5ldz4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3VzZXJzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzx1c2Vycz48L3VzZXJzPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvZGFzaGJvYXJkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkYXNoYm9hcmQtY2FyZHM+PC9kYXNoYm9hcmQtY2FyZHM+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9sb2dvdXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxvZ2luPjwvbG9naW4+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9hY3Rpb24tdGFibGUnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGFjdGlvbi10YWJsZT48L2FjdGlvbi10YWJsZT4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3dlYXRoZXInLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHdlYXRoZXItZGFzaGJvYXJkPjwvd2VhdGhlci1kYXNoYm9hcmQ+J1xyXG4gICAgICAgIH0pO1xyXG59XHJcbnJvdXRlUHJvdmlkZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29uZmlnKHJvdXRlUHJvdmlkZXIpO1xyXG4iLCJjb25zdCBmb290ZXJDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybCA6ICcuL2FwcC9jb21tb24vZm9vdGVyL2Zvb3Rlci5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFNpZGVOYXZDb250cm9sbGVyXHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29tcG9uZW50KCdmb290ZXJDb21wb25lbnQnLCBmb290ZXJDb21wb25lbnQpO1xyXG4iLCJjb25zdCBzaWRlTmF2ID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vc2lkZS1uYXYvc2lkZS1uYXYuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBTaWRlTmF2Q29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3NpZGVOYXYnLCBzaWRlTmF2KTtcclxuIiwiZnVuY3Rpb24gU2lkZU5hdkNvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb250cm9sbGVyKCdTaWRlTmF2Q29udHJvbGxlcicsIFNpZGVOYXZDb250cm9sbGVyKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdtY28nLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ3VzZXInLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcsIFtdKTsiLCJmdW5jdGlvbiBEYXNoYm9hcmRTZXJ2aWNlKCkge1xyXG4gICAgdGhpcy5kZWZhdWx0Q29udGFjdHMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJBbmlsIFZpc2h2a2FybWFcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImFuaWwudmlzaHZrYXJtYUBqY2kuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkpvaG5zb24gQ29udHJvbHMgSW5kaWEgUHZ0LiBMdGQuXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkFrc2hheSBTb25pXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJha3NoYXkuc29uaUBnbWFpbC5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzUzNjMyNzI3XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkltcGV0dXMgTGltaXRlZFwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJFbHlzZSBIb2Jzb25cIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImVseXNlLmhvYnNvbkBiYXJjbGF5cy5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiQmFyY2xheXMgVGVjaG5vbG9neVwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcImZlbWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkRlZXBhayBBaGlyd2FsXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJkZWVwYWsuYWhpcndhbEBjZy5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiQ29nbml6ZW50IFRlY2hub2xvZ3kuXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmdldERlZmF1bHRDb250YWN0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0Q29udGFjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXREZWZhdWx0Q29udGFjdHMgPSBmdW5jdGlvbiAobmV3Q29udGFjdCkge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdENvbnRhY3RzLnB1c2gobmV3Q29udGFjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290Jykuc2VydmljZSgnRGFzaGJvYXJkU2VydmljZScsIERhc2hib2FyZFNlcnZpY2UpO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2VhdGhlcicsIFtdKTsiLCJcclxuY29uc3QgdG9wTmF2TG9naW4gPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFRvcE5hdkxvZ2luQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3RvcE5hdkxvZ2luJywgdG9wTmF2TG9naW4pOyIsImZ1bmN0aW9uIFRvcE5hdkxvZ2luQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgdXNlclJlc3BvbnNlID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiQW5pbCBWaXNodmthcm1hXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJhbmlsLnZpc2h2a2FybWFAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluZGlhIFB2dC4gTHRkLlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJBa3NoYXkgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiYWtzaGF5LnNvbmlAZ21haWwuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTc1MzYzMjcyN1wiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJJbXBldHVzIExpbWl0ZWRcIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VuaWwgU29uaVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwic3VuaWwuc29uaUBiYXJjbGF5cy5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiQmFyY2xheXMgVGVjaG5vbG9neVwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJEZWVwYWsgQWhpcndhbFwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZGVlcGFrLmFoaXJ3YWxAY2cuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkNvZ25pemVudCBUZWNobm9sb2d5LlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJQaXl1c2ggVmlqYXl2YXJnaXlhXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJwaXl1c2gudmd5QHRlY2htLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJUZWNoIE1haGluZHJhXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkVseXNlIEhvYnNvblwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZWx5c2VAamNpLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJKb2huc29uIENvbnRyb2xzIEluYy5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJmZW1hbGVcIlxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkodXNlclJlc3BvbnNlKSk7XHJcblxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInJvb3RcIikuY29udHJvbGxlcihcIlRvcE5hdkxvZ2luQ29udHJvbGxlclwiLCBUb3BOYXZMb2dpbkNvbnRyb2xsZXIpOyIsImNvbnN0IHRvcE5hdkxvZ291dCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dvdXQvdG9wLW5hdi1sb2dvdXQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBUb3BOYXZMb2dvdXRDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgndG9wTmF2TG9nb3V0JywgdG9wTmF2TG9nb3V0KTsiLCJmdW5jdGlvbiBUb3BOYXZMb2dvdXRDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwicm9vdFwiKS5jb250cm9sbGVyKFwiVG9wTmF2TG9nb3V0Q29udHJvbGxlclwiLCBUb3BOYXZMb2dvdXRDb250cm9sbGVyKTsiLCJjb25zdCBsb2dpbiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29tcG9uZW50KCdsb2dpbicsIGxvZ2luKTtcclxuIiwiZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRsb2NhdGlvbikge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9ICdhbmlsJztcclxuICAgIGNvbnN0IHBhc3N3b3JkID0gJ0luZGlhQDEyMyc7XHJcbiAgICBsZXQgaXNMb2dpbkZhaWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGN0cmwubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICBpZiAoY3JlZGVudGlhbHMgJiYgY3JlZGVudGlhbHMudXNlcm5hbWUgPT09IHVzZXJuYW1lICYmIGNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSBwYXNzd29yZCkge1xyXG4gICAgICAgICAgICBpc0xvZ2luRmFpbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dpbicsIHRydWUpO1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Rhc2hib2FyZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpc0xvZ2luRmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICBjdHJsLmxvZ2luU3RhdHVzID0gaXNMb2dpbkZhaWxlZDtcclxuICAgICAgICBjdHJsLmxvZ2luRXJyb3JNZXNzYWdlID0gJ0ludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQhJztcclxuICAgIH1cclxufVxyXG5cclxuTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTtcclxuIiwiY29uc3QgYWN0aW9uVGFibGUgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS9hY3Rpb24tdGFibGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBBY3Rpb25UYWJsZUNvbnRyb2xsZXJcclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlJywgYWN0aW9uVGFibGUpO1xyXG4iLCJmdW5jdGlvbiBBY3Rpb25UYWJsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuXHJcbiAgICBjdHJsLm1jb09iamVjdERldGFpbHMgPSB7XHJcbiAgICAgICAgc3RhdGVzVGV4dDogJ1N0YXRlcycsXHJcbiAgICAgICAgbm9PZlN0YXRlczogNCxcclxuICAgICAgICByZWxpbnF1aXNoRGVmYXVsdDogJ1N0YXRlIDAnXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zaG93Q29sbGFwc2libGVBY3Rpb25UYWJsZSA9IHRydWU7XHJcbiAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gZmFsc2U7XHJcblxyXG4gICAgY3RybC5zaG93Q29sbGFwc2libGVUYWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5zaG93Tm9ybWFsQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLnNob3dOb3JtYWxUYWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLm1jb1N0YXRlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDEwJyxcclxuICAgICAgICAgICAgc3RhdHVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYwMScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ09uJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjAxJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnT2ZmJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDIwJyxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYyMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XHJcblxyXG5BY3Rpb25UYWJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29udHJvbGxlcignQWN0aW9uVGFibGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVDb250cm9sbGVyKTtcclxuIiwiY29uc3QgYWN0aW9uVGFibGVJdGVtc05vcm1hbCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIGl0ZW1zOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlSXRlbXNOb3JtYWwnLCBhY3Rpb25UYWJsZUl0ZW1zTm9ybWFsKTtcclxuXHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgIFxyXG4gICAgJHNjb3BlLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgY3RybC50b2dnbGVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5pc0V4cGFuZGVkID0gISgkc2NvcGUuaXNFeHBhbmRlZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCBhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBpdGVtczogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUnLCBhY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGUpO1xyXG5cclxuIiwiZnVuY3Rpb24gQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG5cclxuICAgICRzY29wZS5pc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGN0cmwudG9nZ2xlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuaXNFeHBhbmRlZCA9ICEoJHNjb3BlLmlzRXhwYW5kZWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXInLCBBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyKTtcclxuIiwiY29uc3QgdXNlck5ldyA9IHtcclxuICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5odG1sJyxcclxuICBjb250cm9sbGVyOiBVc2VyTmV3Q29udHJvbGxlcixcclxuICBiaW5kaW5nczoge1xyXG4gICAgdXNlcjogJzwnXHJcbiAgfVxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbXBvbmVudCgndXNlck5ldycsIHVzZXJOZXcpO1xyXG4iLCJmdW5jdGlvbiBVc2VyTmV3Q29udHJvbGxlcihEYXNoYm9hcmRTZXJ2aWNlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIFxyXG4gICAgY3RybC51c2VyID0ge307XHJcblxyXG4gICAgY3RybC5uZXdVc2VyID0gZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXIuZmlyc3ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1VzZXIgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGAke3VzZXIuZmlyc3ROYW1lfSAke3VzZXIubGFzdE5hbWV9YCxcclxuICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIG1vYmlsZTogdXNlci5tb2JpbGUsXHJcbiAgICAgICAgICAgIGNvbXBhbnk6IHVzZXIuY29tcGFueSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB1c2VyLmdlbmRlclxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIERhc2hib2FyZFNlcnZpY2Uuc2V0RGVmYXVsdENvbnRhY3RzKG5ld1VzZXIpO1xyXG4gICAgICAgIGN0cmwudXNlciA9IHt9O1xyXG4gICAgfVxyXG59XHJcblxyXG5Vc2VyTmV3Q29udHJvbGxlci4kaW5qZWN0ID0gWydEYXNoYm9hcmRTZXJ2aWNlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbnRyb2xsZXIoJ1VzZXJOZXdDb250cm9sbGVyJywgVXNlck5ld0NvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCB1c2VycyA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogVXNlcnNDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbXBvbmVudCgndXNlcnMnLCB1c2Vycyk7XHJcbiIsImZ1bmN0aW9uIFVzZXJzQ29udHJvbGxlcigkc2NvcGUsIERhc2hib2FyZFNlcnZpY2UpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY3RybC51c2VycyA9IERhc2hib2FyZFNlcnZpY2UuZ2V0RGVmYXVsdENvbnRhY3RzKCk7XHJcblxyXG4gICAgY3RybC5vcmRlckJ5U2VsZWN0ZWRWYWx1ZSA9ICduYW1lJztcclxuXHJcbiAgICBjdHJsLm9yZGVyQnlWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgY3RybC5vcmRlckJ5U2VsZWN0ZWRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5Vc2Vyc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0Rhc2hib2FyZFNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29udHJvbGxlcignVXNlcnNDb250cm9sbGVyJywgVXNlcnNDb250cm9sbGVyKTtcclxuIiwiY29uc3QgZGFzaGJvYXJkQ2FyZHMgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXJcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbXBvbmVudCgnZGFzaGJvYXJkQ2FyZHMnLCBkYXNoYm9hcmRDYXJkcyk7XHJcbiIsImZ1bmN0aW9uIERhc2hib2FyZENhcmRzQ29udHJvbGxlcihEYXNoYm9hcmRTZXJ2aWNlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuICAgIGN0cmwudXNlcnMgPSBEYXNoYm9hcmRTZXJ2aWNlLmdldERlZmF1bHRDb250YWN0cygpO1xyXG59XHJcblxyXG5EYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnRGFzaGJvYXJkU2VydmljZSddXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29udHJvbGxlcignRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyJywgRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyKTsiLCJjb25zdCB3ZWF0aGVyRGFzaGJvYXJkID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3dlYXRoZXIvd2VhdGhlci1kYXNoYm9hcmQvd2VhdGhlci1kYXNoYm9hcmQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBXZWF0aGVyRGFzaGJvYXJkQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3dlYXRoZXInKS5jb21wb25lbnQoJ3dlYXRoZXJEYXNoYm9hcmQnLCB3ZWF0aGVyRGFzaGJvYXJkKTtcclxuXHJcbiIsImZ1bmN0aW9uIFdlYXRoZXJEYXNoYm9hcmRDb250cm9sbGVyKCRzY29wZSwgQ3VycmVudFdlYXRoZXJTZXJ2aWNlLCBDb21tb25XZWF0aGVyU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICAkc2NvcGUuY2l0eVNlbGVjdGVkID0gJyc7XHJcbiAgICAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDaXR5V2hlYXRoZXIoKSB7XHJcbiAgICAgICAgY29uc3QgY2l0eU5hbWUgPSBDb21tb25XZWF0aGVyU2VydmljZS5nZXRXZWF0aGVyQ2l0eU5hbWUoKTtcclxuICAgICAgICByZXR1cm4gQ3VycmVudFdlYXRoZXJTZXJ2aWNlLmdldFdlYXRoZXJEZXRhaWxzKGNpdHlOYW1lKS50aGVuKGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjdHJsLndoZWF0aGVyUmVzcG9uc2UgPSBjdXJyZW50V2VhdGhlclJlc3BvbnNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgY3RybC53aGVhdGhlclJlc3BvbnNlID0gZXJyO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5nZXRXZWF0aGVyRm9yQ2l0eVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIENvbW1vbldlYXRoZXJTZXJ2aWNlLnNldFdlYXRoZXJDaXR5TmFtZSgkc2NvcGUuY2l0eVNlbGVjdGVkKTtcclxuICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZ2V0Q2l0eVdoZWF0aGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2l0eVdoZWF0aGVyKCk7XHJcbn1cclxuXHJcbldlYXRoZXJEYXNoYm9hcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdDdXJyZW50V2VhdGhlclNlcnZpY2UnLCAnQ29tbW9uV2VhdGhlclNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd3ZWF0aGVyJykuY29udHJvbGxlcignV2VhdGhlckRhc2hib2FyZENvbnRyb2xsZXInLCBXZWF0aGVyRGFzaGJvYXJkQ29udHJvbGxlcik7XHJcbiIsImZ1bmN0aW9uIENvbW1vbldlYXRoZXJTZXJ2aWNlKCkge1xyXG4gICAgdGhpcy5jaXR5VG9Vc2UgPSAnUHVuZSc7XHJcblxyXG4gICAgdGhpcy5zZXRXZWF0aGVyQ2l0eU5hbWUgPSBmdW5jdGlvbiAoY2l0eU5hbWUpIHtcclxuICAgICAgICB0aGlzLmNpdHlUb1VzZSA9IGNpdHlOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0V2VhdGhlckNpdHlOYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNpdHlUb1VzZTtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3dlYXRoZXInKS5zZXJ2aWNlKCdDb21tb25XZWF0aGVyU2VydmljZScsIENvbW1vbldlYXRoZXJTZXJ2aWNlKTsiLCJmdW5jdGlvbiBoYW5kbGVFcnJvclJlc3BvbnNlKHN0YXR1c0NvZGUpIHtcclxuICAgIGxldCBlcnJvclJlc3BvbnNlID0ge307XHJcblxyXG4gICAgc3dpdGNoIChzdGF0dXNDb2RlKSB7XHJcbiAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgIGVycm9yUmVzcG9uc2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmVycm9yTWVzc2FnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDQwMDpcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5lcnJvck1lc3NhZ2UgPSAnWW91IGhhdmUgcHJvdmlkZWQgaW52YWxpZCBpbnB1dC4gUGxlYXNlIGVudGVyIHZhbGlkIGNpdHkgbmFtZSB0byBzZWFyY2ghISc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5lcnJvck1lc3NhZ2UgPSAnVGhpcyBjaXR5IGRvZXMgbm90IGV4aXN0ISc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5lcnJvck1lc3NhZ2UgPSAnSW50ZXJuYWwgU2VydmVyIEVycm9yJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlcnJvclJlc3BvbnNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXNwb25zZSkge1xyXG4gICAgaWYgKCFyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnN0IGVycm9yUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIGlzRXJyb3I6IHRydWUsXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJXZWF0aGVyIHJlc3BvbnNlIGlzIG5vdCByZXNwb25kaW5nLiBQbGVhc2UgdHJ5IGFnYWluIGFmdGVyIHNvbWUgdGltZS5cIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBlcnJvclJlc3BvbnNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoYW5kbGVFcnJvclJlc3BvbnNlKHJlc3BvbnNlLnN0YXR1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVXZWF0aGVyUmVzcG9uc2UocmVzcG9uc2VEYXRhKSB7XHJcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlckRhdGEgPSB7XHJcbiAgICAgICAgaXNFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgY2l0eTogcmVzcG9uc2VEYXRhLmxvY2F0aW9uLm5hbWUsXHJcbiAgICAgICAgc3RhdGU6IHJlc3BvbnNlRGF0YS5sb2NhdGlvbi5yZWdpb24sXHJcbiAgICAgICAgY291bnRyeTogcmVzcG9uc2VEYXRhLmxvY2F0aW9uLmNvdW50cnksXHJcbiAgICAgICAgbG9jYWxUaW1lOiByZXNwb25zZURhdGEubG9jYXRpb24ubG9jYWx0aW1lLFxyXG4gICAgICAgIHRlbXBfYzogTWF0aC5yb3VuZChyZXNwb25zZURhdGEuY3VycmVudC50ZW1wX2MpLFxyXG4gICAgICAgIHRlbXBfZjogTWF0aC5yb3VuZChyZXNwb25zZURhdGEuY3VycmVudC50ZW1wX2YpLFxyXG4gICAgICAgIGZlZWxzbGlrZV9jOiByZXNwb25zZURhdGEuY3VycmVudC5mZWVsc2xpa2VfYyxcclxuICAgICAgICBodW1pZGl0eTogcmVzcG9uc2VEYXRhLmN1cnJlbnQuaHVtaWRpdHksXHJcbiAgICAgICAgcHJlc3N1cmU6IHJlc3BvbnNlRGF0YS5jdXJyZW50LnByZXNzdXJlX21iLFxyXG4gICAgICAgIGNsb3VkX3N0YXRlOiByZXNwb25zZURhdGEuY3VycmVudC5jb25kaXRpb24udGV4dCxcclxuICAgICAgICBjbG91ZF9pY29uOiByZXNwb25zZURhdGEuY3VycmVudC5jb25kaXRpb24uaWNvblxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gY3VycmVudFdlYXRoZXJEYXRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDdXJyZW50V2VhdGhlclNlcnZpY2UoJGh0dHAsICRxKSB7XHJcbiAgICB0aGlzLmdldFdlYXRoZXJEZXRhaWxzID0gZnVuY3Rpb24gKGNpdHkpIHtcclxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgY29uc3Qgd2VhdGhlcl9hcGkgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvY3VycmVudC5qc29uP2tleT1mMjllYzIxNmZlMGY0ZTRkYTVmNjU2MzIyMDMwMDQmcT0ke2NpdHl9YDtcclxuXHJcbiAgICAgICAgJGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6IHdlYXRoZXJfYXBpIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VTdGF0dXMgPSBoYW5kbGVSZXNwb25zZShyZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlU3RhdHVzLmlzRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlU3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcmVwYXJlV2VhdGhlclJlc3BvbnNlKHJlc3BvbnNlLmRhdGEpKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRXJyb3I6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnIuZGF0YS5lcnJvci5tZXNzYWdlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbkN1cnJlbnRXZWF0aGVyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5zZXJ2aWNlKCdDdXJyZW50V2VhdGhlclNlcnZpY2UnLCBDdXJyZW50V2VhdGhlclNlcnZpY2UpO1xyXG4iLCJmdW5jdGlvbiBwcmVwYXJlV2VhdGhlckZvcmVjYXN0UmVzcG9uc2UocmVzcG9uc2VEYXRhKSB7XHJcbiAgICBjb25zdCBmb3JlY2FzdERheXMgPSByZXNwb25zZURhdGEuZm9yZWNhc3QuZm9yZWNhc3RkYXk7XHJcbiAgICBjb25zdCBmb3JlY2FzdExpc3QgPSBbXTtcclxuXHJcbiAgICBmb3JlY2FzdERheXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBsZXQgZm9yZWNhc3REYXRhID0ge1xyXG4gICAgICAgICAgICB0ZW1wX2hpZ2g6IGVsZW1lbnQuZGF5Lm1heHRlbXBfYyxcclxuICAgICAgICAgICAgdGVtcF9sb3c6IGVsZW1lbnQuZGF5Lm1pbnRlbXBfYyxcclxuICAgICAgICAgICAgY2xvdWRfaWNvbjogZWxlbWVudC5kYXkuY29uZGl0aW9uLmljb24sXHJcbiAgICAgICAgICAgIGRhdGVfbW9udGg6IGVsZW1lbnQuZGF0ZSxcclxuICAgICAgICAgICAgY2xvdWRfc3RhdGU6IGVsZW1lbnQuZGF5LmNvbmRpdGlvbi50ZXh0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZm9yZWNhc3RMaXN0LnB1c2goZm9yZWNhc3REYXRhKTtcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIGZvcmVjYXN0TGlzdDtcclxufVxyXG5cclxuZnVuY3Rpb24gRm9yZWNhc3RXZWF0aGVyU2VydmljZSgkaHR0cCwgJHEpIHtcclxuICAgIHRoaXMuZ2V0V2VhdGhlckZvcmVjYXN0ID0gZnVuY3Rpb24gKGNpdHkpIHtcclxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgY29uc3Qgd2VhdGhlcl9hcGkgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9ZjI5ZWMyMTZmZTBmNGU0ZGE1ZjY1NjMyMjAzMDA0JnE9JHtjaXR5fSZkYXlzPTNgO1xyXG5cclxuICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogd2VhdGhlcl9hcGkgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvclJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Vycm9yOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiV2VhdGhlciByZXNwb25zZSBpcyBub3QgcmVzcG9uZGluZy4gUGxlYXNlIHRyeSBhZ2FpbiBhZnRlciBzb21lIHRpbWUuXCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVycm9yUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHByZXBhcmVXZWF0aGVyRm9yZWNhc3RSZXNwb25zZShyZXNwb25zZS5kYXRhKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpc0Vycm9yOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyLmRhdGEuZXJyb3IubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5Gb3JlY2FzdFdlYXRoZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRxJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLnNlcnZpY2UoJ0ZvcmVjYXN0V2VhdGhlclNlcnZpY2UnLCBGb3JlY2FzdFdlYXRoZXJTZXJ2aWNlKTsiLCJjb25zdCB3ZWF0aGVyRm9yZWNhc3QgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLWZvcmVjYXN0L3dlYXRoZXItZm9yZWNhc3QuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBXZWF0aGVyRm9yZWNhc3RDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnd2VhdGhlcicpLmNvbXBvbmVudCgnd2VhdGhlckZvcmVjYXN0Jywgd2VhdGhlckZvcmVjYXN0KTtcclxuIiwiZnVuY3Rpb24gV2VhdGhlckZvcmVjYXN0Q29udHJvbGxlcigkc2NvcGUsIEZvcmVjYXN0V2VhdGhlclNlcnZpY2UsIENvbW1vbldlYXRoZXJTZXJ2aWNlKSB7XHJcbiAgICB2YXIgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Zm9yZWNhc3RXZWF0aGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGNpdHlOYW1lID0gQ29tbW9uV2VhdGhlclNlcnZpY2UuZ2V0V2VhdGhlckNpdHlOYW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIEZvcmVjYXN0V2VhdGhlclNlcnZpY2UuZ2V0V2VhdGhlckZvcmVjYXN0KGNpdHlOYW1lKS50aGVuKGZvcmVjYXN0UmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjdHJsLmZvcmVjYXN0RGV0YWlscyA9IGZvcmVjYXN0UmVzcG9uc2U7XHJcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgY3RybC5mb3JlY2FzdERldGFpbHMgPSBmb3JlY2FzdFJlc3BvbnNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Zm9yZWNhc3RXZWF0aGVyKCk7XHJcbn1cclxuXHJcbldlYXRoZXJGb3JlY2FzdENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZvcmVjYXN0V2VhdGhlclNlcnZpY2UnLCAnQ29tbW9uV2VhdGhlclNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd3ZWF0aGVyJykuY29udHJvbGxlcignV2VhdGhlckZvcmVjYXN0Q29udHJvbGxlcicsIFdlYXRoZXJGb3JlY2FzdENvbnRyb2xsZXIpO1xyXG4iXX0=
