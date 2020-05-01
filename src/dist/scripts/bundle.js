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

angular.module('authentication', []);
const sideNav = {
    templateUrl: './app/common/side-nav/side-nav.html',
    controller: SideNavController
};

angular.module('root').component('sideNav', sideNav);

function SideNavController() {
    const ctrl = this;
}

angular.module('root').controller('SideNavController', SideNavController);

angular.module('mco', []);
angular.module('user', []);
angular.module('weather', []);
angular.module('dashboard', []);

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

const users = {
    templateUrl: './app/components/user/users/users.html',
    controller: UsersController
};

angular.module('user').component('users', users);

function UsersController() {
    const ctrl = this;
    const users = JSON.parse(localStorage.getItem('users'));
    ctrl.users = users;
}

angular.module('user').controller('UsersController', UsersController);

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

const dashboardCards = {
    templateUrl: './app/components/dashboard/dashboard-cards/dashboard-cards.html',
    controller: DashboardCardsController
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAucm91dGVzLmpzIiwiY29tbW9uL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9hdXRoZW50aWNhdGlvbi5tb2R1bGUuanMiLCJjb21tb24vc2lkZS1uYXYvc2lkZS1uYXYuY29tcG9uZW50LmpzIiwiY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2LmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9tY28ubW9kdWxlLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXIubW9kdWxlLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXIubW9kdWxlLmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLm1vZHVsZS5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5jb21wb25lbnQuanMiLCJjb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ2luL3RvcC1uYXYtbG9naW4uY29udHJvbGxlci5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9nb3V0L3RvcC1uYXYtbG9nb3V0LmNvbXBvbmVudC5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9nb3V0L3RvcC1uYXYtbG9nb3V0LmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS9hY3Rpb24tdGFibGUuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItZGFzaGJvYXJkL3dlYXRoZXItZGFzaGJvYXJkLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLWRhc2hib2FyZC93ZWF0aGVyLWRhc2hib2FyZC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItc2VydmljZXMvY29tbW9uLXdlYXRoZXIuc2VydmljZS5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLXNlcnZpY2VzL2N1cnJlbnQtd2VhdGhlci5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItc2VydmljZXMvZm9yZWNhc3Qtd2VhdGhlci5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2xvZ2luL2xvZ2luLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3VzZXIvdXNlci1uZXcvdXNlci1uZXcuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXItbmV3L3VzZXItbmV3LmNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3dlYXRoZXIvd2VhdGhlci1mb3JlY2FzdC93ZWF0aGVyLWZvcmVjYXN0LmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLWZvcmVjYXN0L3dlYXRoZXItZm9yZWNhc3QuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUNBQTtBQ0FBO0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgncm9vdCcsIFtcclxuICAgICduZ1JvdXRlJyxcclxuICAgICdkYXNoYm9hcmQnLFxyXG4gICAgJ3VzZXInLFxyXG4gICAgJ2F1dGhlbnRpY2F0aW9uJyxcclxuICAgICdtY28nLFxyXG4gICAgJ3dlYXRoZXInXHJcbl0pO1xyXG5cclxuIiwiZnVuY3Rpb24gcm91dGVQcm92aWRlcigkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8bG9naW4+PC9sb2dpbj4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3VzZXIvbmV3Jywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzx1c2VyLW5ldz48L3VzZXItbmV3PidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvdXNlcnMnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVzZXJzPjwvdXNlcnM+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9kYXNoYm9hcmQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRhc2hib2FyZC1jYXJkcz48L2Rhc2hib2FyZC1jYXJkcz4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2xvZ291dCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8bG9naW4+PC9sb2dpbj4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2FjdGlvbi10YWJsZScsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8YWN0aW9uLXRhYmxlPjwvYWN0aW9uLXRhYmxlPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvd2VhdGhlcicsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8d2VhdGhlci1kYXNoYm9hcmQ+PC93ZWF0aGVyLWRhc2hib2FyZD4nXHJcbiAgICAgICAgfSk7XHJcbn1cclxucm91dGVQcm92aWRlci4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlciddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb25maWcocm91dGVQcm92aWRlcik7XHJcbiIsImNvbnN0IGZvb3RlckNvbXBvbmVudCA9IHtcclxuICAgIHRlbXBsYXRlVXJsIDogJy4vYXBwL2NvbW1vbi9mb290ZXIvZm9vdGVyLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogU2lkZU5hdkNvbnRyb2xsZXJcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ2Zvb3RlckNvbXBvbmVudCcsIGZvb3RlckNvbXBvbmVudCk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdhdXRoZW50aWNhdGlvbicsIFtdKTsiLCJjb25zdCBzaWRlTmF2ID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vc2lkZS1uYXYvc2lkZS1uYXYuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBTaWRlTmF2Q29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3NpZGVOYXYnLCBzaWRlTmF2KTtcclxuIiwiZnVuY3Rpb24gU2lkZU5hdkNvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb250cm9sbGVyKCdTaWRlTmF2Q29udHJvbGxlcicsIFNpZGVOYXZDb250cm9sbGVyKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ21jbycsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgndXNlcicsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnd2VhdGhlcicsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJywgW10pOyIsIlxyXG5jb25zdCB0b3BOYXZMb2dpbiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3RvcC1uYXYvdG9wLW5hdi1sb2dpbi90b3AtbmF2LWxvZ2luLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogVG9wTmF2TG9naW5Db250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgndG9wTmF2TG9naW4nLCB0b3BOYXZMb2dpbik7IiwiZnVuY3Rpb24gVG9wTmF2TG9naW5Db250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCB1c2VyUmVzcG9uc2UgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJBbmlsIFZpc2h2a2FybWFcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImFuaWwudmlzaHZrYXJtYUBqY2kuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkpvaG5zb24gQ29udHJvbHMgSW5kaWEgUHZ0LiBMdGQuXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkFrc2hheSBTb25pXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJha3NoYXkuc29uaUBnbWFpbC5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzUzNjMyNzI3XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkltcGV0dXMgTGltaXRlZFwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcIm1hbGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJTdW5pbCBTb25pXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJzdW5pbC5zb25pQGJhcmNsYXlzLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJCYXJjbGF5cyBUZWNobm9sb2d5XCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkRlZXBhayBBaGlyd2FsXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJkZWVwYWsuYWhpcndhbEBjZy5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiQ29nbml6ZW50IFRlY2hub2xvZ3kuXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIlBpeXVzaCBWaWpheXZhcmdpeWFcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcInBpeXVzaC52Z3lAdGVjaG0uY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIlRlY2ggTWFoaW5kcmFcIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiRWx5c2UgSG9ic29uXCIsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJlbHlzZUBqY2kuY29tXCIsXHJcbiAgICAgICAgICAgIFwibW9iaWxlXCI6IFwiOTcxMzQ0ODY0XCIsXHJcbiAgICAgICAgICAgIFwiY29tcGFueVwiOiBcIkpvaG5zb24gQ29udHJvbHMgSW5jLlwiLFxyXG4gICAgICAgICAgICBcImdlbmRlclwiOiBcImZlbWFsZVwiXHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcnMnLCBKU09OLnN0cmluZ2lmeSh1c2VyUmVzcG9uc2UpKTtcclxuXHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwicm9vdFwiKS5jb250cm9sbGVyKFwiVG9wTmF2TG9naW5Db250cm9sbGVyXCIsIFRvcE5hdkxvZ2luQ29udHJvbGxlcik7IiwiY29uc3QgdG9wTmF2TG9nb3V0ID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ291dC90b3AtbmF2LWxvZ291dC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFRvcE5hdkxvZ291dENvbnRyb2xsZXJcclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29tcG9uZW50KCd0b3BOYXZMb2dvdXQnLCB0b3BOYXZMb2dvdXQpOyIsImZ1bmN0aW9uIFRvcE5hdkxvZ291dENvbnRyb2xsZXIoKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJyb290XCIpLmNvbnRyb2xsZXIoXCJUb3BOYXZMb2dvdXRDb250cm9sbGVyXCIsIFRvcE5hdkxvZ291dENvbnRyb2xsZXIpOyIsImNvbnN0IGFjdGlvblRhYmxlID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZScsIGFjdGlvblRhYmxlKTtcclxuIiwiZnVuY3Rpb24gQWN0aW9uVGFibGVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgY3RybC5tY29PYmplY3REZXRhaWxzID0ge1xyXG4gICAgICAgIHN0YXRlc1RleHQ6ICdTdGF0ZXMnLFxyXG4gICAgICAgIG5vT2ZTdGF0ZXM6IDQsXHJcbiAgICAgICAgcmVsaW5xdWlzaERlZmF1bHQ6ICdTdGF0ZSAwJ1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSB0cnVlO1xyXG4gICAgJHNjb3BlLnNob3dOb3JtYWxBY3Rpb25UYWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIGN0cmwuc2hvd0NvbGxhcHNpYmxlVGFibGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnNob3dDb2xsYXBzaWJsZUFjdGlvblRhYmxlID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5zaG93Tm9ybWFsVGFibGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnNob3dOb3JtYWxBY3Rpb25UYWJsZSA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLnNob3dDb2xsYXBzaWJsZUFjdGlvblRhYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5tY29TdGF0ZXMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGF0ZU5hbWU6ICdTdGF0ZSAxMCcsXHJcbiAgICAgICAgICAgIHN0YXR1czogdHJ1ZSxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMDEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdPbicsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYwMScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ09mZicsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMjAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGF0ZU5hbWU6ICdTdGF0ZSAyMCcsXHJcbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdBVjEwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnQ29vbGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6ICcxNiAoRGVmYXVsdCknLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAnMTAwIFNlY29uZHMnXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0JWMjAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdIZWF0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF1cclxufVxyXG5cclxuQWN0aW9uVGFibGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlQ29udHJvbGxlcicsIEFjdGlvblRhYmxlQ29udHJvbGxlcik7XHJcbiIsImNvbnN0IGFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZSA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IEFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIGl0ZW1zOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZScsIGFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZSk7XHJcblxyXG4iLCJmdW5jdGlvbiBBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgJHNjb3BlLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgY3RybC50b2dnbGVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5pc0V4cGFuZGVkID0gISgkc2NvcGUuaXNFeHBhbmRlZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29udHJvbGxlcignQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcicsIEFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCB1c2VycyA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogVXNlcnNDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbXBvbmVudCgndXNlcnMnLCB1c2Vycyk7XHJcbiIsImZ1bmN0aW9uIFVzZXJzQ29udHJvbGxlcigpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICAgY29uc3QgdXNlcnMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKTtcclxuICAgIGN0cmwudXNlcnMgPSB1c2VycztcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb250cm9sbGVyKCdVc2Vyc0NvbnRyb2xsZXInLCBVc2Vyc0NvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCB3ZWF0aGVyRGFzaGJvYXJkID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3dlYXRoZXIvd2VhdGhlci1kYXNoYm9hcmQvd2VhdGhlci1kYXNoYm9hcmQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBXZWF0aGVyRGFzaGJvYXJkQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3dlYXRoZXInKS5jb21wb25lbnQoJ3dlYXRoZXJEYXNoYm9hcmQnLCB3ZWF0aGVyRGFzaGJvYXJkKTtcclxuXHJcbiIsImZ1bmN0aW9uIFdlYXRoZXJEYXNoYm9hcmRDb250cm9sbGVyKCRzY29wZSwgQ3VycmVudFdlYXRoZXJTZXJ2aWNlLCBDb21tb25XZWF0aGVyU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICAkc2NvcGUuY2l0eVNlbGVjdGVkID0gJyc7XHJcbiAgICAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDaXR5V2hlYXRoZXIoKSB7XHJcbiAgICAgICAgY29uc3QgY2l0eU5hbWUgPSBDb21tb25XZWF0aGVyU2VydmljZS5nZXRXZWF0aGVyQ2l0eU5hbWUoKTtcclxuICAgICAgICByZXR1cm4gQ3VycmVudFdlYXRoZXJTZXJ2aWNlLmdldFdlYXRoZXJEZXRhaWxzKGNpdHlOYW1lKS50aGVuKGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjdHJsLndoZWF0aGVyUmVzcG9uc2UgPSBjdXJyZW50V2VhdGhlclJlc3BvbnNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgY3RybC53aGVhdGhlclJlc3BvbnNlID0gZXJyO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5nZXRXZWF0aGVyRm9yQ2l0eVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIENvbW1vbldlYXRoZXJTZXJ2aWNlLnNldFdlYXRoZXJDaXR5TmFtZSgkc2NvcGUuY2l0eVNlbGVjdGVkKTtcclxuICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZ2V0Q2l0eVdoZWF0aGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2l0eVdoZWF0aGVyKCk7XHJcbn1cclxuXHJcbldlYXRoZXJEYXNoYm9hcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdDdXJyZW50V2VhdGhlclNlcnZpY2UnLCAnQ29tbW9uV2VhdGhlclNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd3ZWF0aGVyJykuY29udHJvbGxlcignV2VhdGhlckRhc2hib2FyZENvbnRyb2xsZXInLCBXZWF0aGVyRGFzaGJvYXJkQ29udHJvbGxlcik7XHJcbiIsImZ1bmN0aW9uIENvbW1vbldlYXRoZXJTZXJ2aWNlKCkge1xyXG4gICAgdGhpcy5jaXR5VG9Vc2UgPSAnUHVuZSc7XHJcblxyXG4gICAgdGhpcy5zZXRXZWF0aGVyQ2l0eU5hbWUgPSBmdW5jdGlvbiAoY2l0eU5hbWUpIHtcclxuICAgICAgICB0aGlzLmNpdHlUb1VzZSA9IGNpdHlOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0V2VhdGhlckNpdHlOYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNpdHlUb1VzZTtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3dlYXRoZXInKS5zZXJ2aWNlKCdDb21tb25XZWF0aGVyU2VydmljZScsIENvbW1vbldlYXRoZXJTZXJ2aWNlKTsiLCJmdW5jdGlvbiBoYW5kbGVFcnJvclJlc3BvbnNlKHN0YXR1c0NvZGUpIHtcclxuICAgIGxldCBlcnJvclJlc3BvbnNlID0ge307XHJcblxyXG4gICAgc3dpdGNoIChzdGF0dXNDb2RlKSB7XHJcbiAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICAgIGVycm9yUmVzcG9uc2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmVycm9yTWVzc2FnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDQwMDpcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5lcnJvck1lc3NhZ2UgPSAnWW91IGhhdmUgcHJvdmlkZWQgaW52YWxpZCBpbnB1dC4gUGxlYXNlIGVudGVyIHZhbGlkIGNpdHkgbmFtZSB0byBzZWFyY2ghISc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDQwNDpcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5lcnJvck1lc3NhZ2UgPSAnVGhpcyBjaXR5IGRvZXMgbm90IGV4aXN0ISc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDUwMDpcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5lcnJvck1lc3NhZ2UgPSAnSW50ZXJuYWwgU2VydmVyIEVycm9yJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlcnJvclJlc3BvbnNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXNwb25zZSkge1xyXG4gICAgaWYgKCFyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnN0IGVycm9yUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIGlzRXJyb3I6IHRydWUsXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJXZWF0aGVyIHJlc3BvbnNlIGlzIG5vdCByZXNwb25kaW5nLiBQbGVhc2UgdHJ5IGFnYWluIGFmdGVyIHNvbWUgdGltZS5cIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBlcnJvclJlc3BvbnNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoYW5kbGVFcnJvclJlc3BvbnNlKHJlc3BvbnNlLnN0YXR1cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVXZWF0aGVyUmVzcG9uc2UocmVzcG9uc2VEYXRhKSB7XHJcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlckRhdGEgPSB7XHJcbiAgICAgICAgaXNFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgY2l0eTogcmVzcG9uc2VEYXRhLmxvY2F0aW9uLm5hbWUsXHJcbiAgICAgICAgc3RhdGU6IHJlc3BvbnNlRGF0YS5sb2NhdGlvbi5yZWdpb24sXHJcbiAgICAgICAgY291bnRyeTogcmVzcG9uc2VEYXRhLmxvY2F0aW9uLmNvdW50cnksXHJcbiAgICAgICAgbG9jYWxUaW1lOiByZXNwb25zZURhdGEubG9jYXRpb24ubG9jYWx0aW1lLFxyXG4gICAgICAgIHRlbXBfYzogTWF0aC5yb3VuZChyZXNwb25zZURhdGEuY3VycmVudC50ZW1wX2MpLFxyXG4gICAgICAgIHRlbXBfZjogTWF0aC5yb3VuZChyZXNwb25zZURhdGEuY3VycmVudC50ZW1wX2YpLFxyXG4gICAgICAgIGZlZWxzbGlrZV9jOiByZXNwb25zZURhdGEuY3VycmVudC5mZWVsc2xpa2VfYyxcclxuICAgICAgICBodW1pZGl0eTogcmVzcG9uc2VEYXRhLmN1cnJlbnQuaHVtaWRpdHksXHJcbiAgICAgICAgcHJlc3N1cmU6IHJlc3BvbnNlRGF0YS5jdXJyZW50LnByZXNzdXJlX21iLFxyXG4gICAgICAgIGNsb3VkX3N0YXRlOiByZXNwb25zZURhdGEuY3VycmVudC5jb25kaXRpb24udGV4dCxcclxuICAgICAgICBjbG91ZF9pY29uOiByZXNwb25zZURhdGEuY3VycmVudC5jb25kaXRpb24uaWNvblxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gY3VycmVudFdlYXRoZXJEYXRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDdXJyZW50V2VhdGhlclNlcnZpY2UoJGh0dHAsICRxKSB7XHJcbiAgICB0aGlzLmdldFdlYXRoZXJEZXRhaWxzID0gZnVuY3Rpb24gKGNpdHkpIHtcclxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgY29uc3Qgd2VhdGhlcl9hcGkgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvY3VycmVudC5qc29uP2tleT1mMjllYzIxNmZlMGY0ZTRkYTVmNjU2MzIyMDMwMDQmcT0ke2NpdHl9YDtcclxuXHJcbiAgICAgICAgJGh0dHAoeyBtZXRob2Q6ICdHRVQnLCB1cmw6IHdlYXRoZXJfYXBpIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VTdGF0dXMgPSBoYW5kbGVSZXNwb25zZShyZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlU3RhdHVzLmlzRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlU3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcmVwYXJlV2VhdGhlclJlc3BvbnNlKHJlc3BvbnNlLmRhdGEpKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRXJyb3I6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnIuZGF0YS5lcnJvci5tZXNzYWdlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbkN1cnJlbnRXZWF0aGVyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5zZXJ2aWNlKCdDdXJyZW50V2VhdGhlclNlcnZpY2UnLCBDdXJyZW50V2VhdGhlclNlcnZpY2UpO1xyXG4iLCJmdW5jdGlvbiBwcmVwYXJlV2VhdGhlckZvcmVjYXN0UmVzcG9uc2UocmVzcG9uc2VEYXRhKSB7XHJcbiAgICBjb25zdCBmb3JlY2FzdERheXMgPSByZXNwb25zZURhdGEuZm9yZWNhc3QuZm9yZWNhc3RkYXk7XHJcbiAgICBjb25zdCBmb3JlY2FzdExpc3QgPSBbXTtcclxuXHJcbiAgICBmb3JlY2FzdERheXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBsZXQgZm9yZWNhc3REYXRhID0ge1xyXG4gICAgICAgICAgICB0ZW1wX2hpZ2g6IGVsZW1lbnQuZGF5Lm1heHRlbXBfYyxcclxuICAgICAgICAgICAgdGVtcF9sb3c6IGVsZW1lbnQuZGF5Lm1pbnRlbXBfYyxcclxuICAgICAgICAgICAgY2xvdWRfaWNvbjogZWxlbWVudC5kYXkuY29uZGl0aW9uLmljb24sXHJcbiAgICAgICAgICAgIGRhdGVfbW9udGg6IGVsZW1lbnQuZGF0ZSxcclxuICAgICAgICAgICAgY2xvdWRfc3RhdGU6IGVsZW1lbnQuZGF5LmNvbmRpdGlvbi50ZXh0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZm9yZWNhc3RMaXN0LnB1c2goZm9yZWNhc3REYXRhKTtcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIGZvcmVjYXN0TGlzdDtcclxufVxyXG5cclxuZnVuY3Rpb24gRm9yZWNhc3RXZWF0aGVyU2VydmljZSgkaHR0cCwgJHEpIHtcclxuICAgIHRoaXMuZ2V0V2VhdGhlckZvcmVjYXN0ID0gZnVuY3Rpb24gKGNpdHkpIHtcclxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgY29uc3Qgd2VhdGhlcl9hcGkgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9ZjI5ZWMyMTZmZTBmNGU0ZGE1ZjY1NjMyMjAzMDA0JnE9JHtjaXR5fSZkYXlzPTNgO1xyXG5cclxuICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogd2VhdGhlcl9hcGkgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvclJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Vycm9yOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiV2VhdGhlciByZXNwb25zZSBpcyBub3QgcmVzcG9uZGluZy4gUGxlYXNlIHRyeSBhZ2FpbiBhZnRlciBzb21lIHRpbWUuXCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVycm9yUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHByZXBhcmVXZWF0aGVyRm9yZWNhc3RSZXNwb25zZShyZXNwb25zZS5kYXRhKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpc0Vycm9yOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyLmRhdGEuZXJyb3IubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5Gb3JlY2FzdFdlYXRoZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRxJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLnNlcnZpY2UoJ0ZvcmVjYXN0V2VhdGhlclNlcnZpY2UnLCBGb3JlY2FzdFdlYXRoZXJTZXJ2aWNlKTsiLCJjb25zdCBsb2dpbiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29tcG9uZW50KCdsb2dpbicsIGxvZ2luKTtcclxuIiwiZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRsb2NhdGlvbikge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9ICdhbmlsJztcclxuICAgIGNvbnN0IHBhc3N3b3JkID0gJ0luZGlhQDEyMyc7XHJcbiAgICBsZXQgaXNMb2dpbkZhaWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGN0cmwubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICBpZiAoY3JlZGVudGlhbHMgJiYgY3JlZGVudGlhbHMudXNlcm5hbWUgPT09IHVzZXJuYW1lICYmIGNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSBwYXNzd29yZCkge1xyXG4gICAgICAgICAgICBpc0xvZ2luRmFpbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dpbicsIHRydWUpO1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Rhc2hib2FyZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpc0xvZ2luRmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICBjdHJsLmxvZ2luU3RhdHVzID0gaXNMb2dpbkZhaWxlZDtcclxuICAgICAgICBjdHJsLmxvZ2luRXJyb3JNZXNzYWdlID0gJ0ludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQhJztcclxuICAgIH1cclxufVxyXG5cclxuTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTtcclxuIiwiY29uc3QgYWN0aW9uVGFibGVJdGVtc05vcm1hbCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIGl0ZW1zOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlSXRlbXNOb3JtYWwnLCBhY3Rpb25UYWJsZUl0ZW1zTm9ybWFsKTtcclxuXHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgIFxyXG4gICAgJHNjb3BlLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgY3RybC50b2dnbGVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5pc0V4cGFuZGVkID0gISgkc2NvcGUuaXNFeHBhbmRlZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbnRyb2xsZXIoJ0FjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc05vcm1hbENvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCB1c2VyTmV3ID0ge1xyXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy91c2VyL3VzZXItbmV3L3VzZXItbmV3Lmh0bWwnLFxyXG4gIGNvbnRyb2xsZXI6IFVzZXJOZXdDb250cm9sbGVyLFxyXG4gIGJpbmRpbmdzOiB7XHJcbiAgICB1c2VyOiAnPCdcclxuICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29tcG9uZW50KCd1c2VyTmV3JywgdXNlck5ldyk7XHJcbiIsImZ1bmN0aW9uIFVzZXJOZXdDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjdHJsLnVzZXIgPSB7fTtcclxuXHJcbiAgICBjdHJsLm5ld1VzZXIgPSBmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdOZXcgVXNlciBTdWJtaXR0ZWQ6JywgdXNlcik7XHJcbiAgICAgICAgaWYgKCF1c2VyIHx8ICF1c2VyLmZpcnN0TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdVc2VyID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBgJHt1c2VyLmZpcnN0TmFtZX0gJHt1c2VyLmxhc3ROYW1lfWAsXHJcbiAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBtb2JpbGU6IHVzZXIubW9iaWxlLFxyXG4gICAgICAgICAgICBjb21wYW55OiB1c2VyLmNvbXBhbnksXHJcbiAgICAgICAgICAgIGdlbmRlcjogdXNlci5nZW5kZXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBleGlzdGluZ1VzZXJzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnMnKSk7XHJcblxyXG4gICAgICAgIGlmIChleGlzdGluZ1VzZXJzICYmIGV4aXN0aW5nVXNlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBleGlzdGluZ1VzZXJzLnB1c2gobmV3VXNlcik7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycycsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nVXNlcnMpKTtcclxuICAgICAgICAgICAgY3RybC51c2VyID0ge307XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndXNlcicpLmNvbnRyb2xsZXIoJ1VzZXJOZXdDb250cm9sbGVyJywgVXNlck5ld0NvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCB3ZWF0aGVyRm9yZWNhc3QgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLWZvcmVjYXN0L3dlYXRoZXItZm9yZWNhc3QuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBXZWF0aGVyRm9yZWNhc3RDb250cm9sbGVyXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnd2VhdGhlcicpLmNvbXBvbmVudCgnd2VhdGhlckZvcmVjYXN0Jywgd2VhdGhlckZvcmVjYXN0KTtcclxuIiwiZnVuY3Rpb24gV2VhdGhlckZvcmVjYXN0Q29udHJvbGxlcigkc2NvcGUsIEZvcmVjYXN0V2VhdGhlclNlcnZpY2UsIENvbW1vbldlYXRoZXJTZXJ2aWNlKSB7XHJcbiAgICB2YXIgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Zm9yZWNhc3RXZWF0aGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGNpdHlOYW1lID0gQ29tbW9uV2VhdGhlclNlcnZpY2UuZ2V0V2VhdGhlckNpdHlOYW1lKCk7XHJcbiAgICAgICAgcmV0dXJuIEZvcmVjYXN0V2VhdGhlclNlcnZpY2UuZ2V0V2VhdGhlckZvcmVjYXN0KGNpdHlOYW1lKS50aGVuKGZvcmVjYXN0UmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjdHJsLmZvcmVjYXN0RGV0YWlscyA9IGZvcmVjYXN0UmVzcG9uc2U7XHJcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgY3RybC5mb3JlY2FzdERldGFpbHMgPSBmb3JlY2FzdFJlc3BvbnNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Zm9yZWNhc3RXZWF0aGVyKCk7XHJcbn1cclxuXHJcbldlYXRoZXJGb3JlY2FzdENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZvcmVjYXN0V2VhdGhlclNlcnZpY2UnLCAnQ29tbW9uV2VhdGhlclNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd3ZWF0aGVyJykuY29udHJvbGxlcignV2VhdGhlckZvcmVjYXN0Q29udHJvbGxlcicsIFdlYXRoZXJGb3JlY2FzdENvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCBkYXNoYm9hcmRDYXJkcyA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNhcmRzL2Rhc2hib2FyZC1jYXJkcy5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IERhc2hib2FyZENhcmRzQ29udHJvbGxlclxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJykuY29tcG9uZW50KCdkYXNoYm9hcmRDYXJkcycsIGRhc2hib2FyZENhcmRzKTtcclxuIiwiZnVuY3Rpb24gRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyKCkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnMnKSlcclxuXHJcbiAgICBpZiAocGF5bG9hZCAmJiBwYXlsb2FkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjdHJsLnVzZXJzID0gcGF5bG9hZDtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb250cm9sbGVyKCdEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXInLCBEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXIpOyJdfQ==
