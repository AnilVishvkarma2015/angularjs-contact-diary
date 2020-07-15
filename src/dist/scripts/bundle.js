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
    templateUrl : './app/common/footer/footer.html'
}

angular.module('root').component('footerComponent', footerComponent);

const sideNav = {
    templateUrl: './app/common/side-nav/side-nav.html'
};

angular.module('root').component('sideNav', sideNav);

angular.module('dashboard', []);
function DashboardService() {
    this.defaultContacts = [
        {
            "name": "Anil Vishvkarma",
            "email": "anil.vishvkarma@gmail.com",
            "mobile": "971344864",
            "company": "India Pvt. Ltd.",
            "gender": "male"
        },
        {
            "name": "Akshay Soni",
            "email": "akshay.soni@gmail.com",
            "mobile": "9753632727",
            "company": "Limited",
            "gender": "male"
        },
        {
            "name": "Elyse Hobson",
            "email": "elyse.hobson@br.com",
            "mobile": "971344864",
            "company": "Technology",
            "gender": "female"
        },
        {
            "name": "Deepak Ahirwal",
            "email": "deepak.ahirwal@cg.com",
            "mobile": "971344864",
            "company": "Technology.",
            "gender": "male"
        }
    ];

    this.getDefaultContacts = function () {
        return this.defaultContacts;
    }

    this.setNewContact = function (newContact) {
        this.defaultContacts.push(newContact);
    }
}

angular.module('root').service('DashboardService', DashboardService);

angular.module('weather', []);
angular.module('user', []);
angular.module('authentication', []);

angular.module('mco', []);
const topNavLogin = {
    templateUrl: './app/common/top-nav/top-nav-login/top-nav-login.html'
};

angular.module('root').component('topNavLogin', topNavLogin);
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
            ctrl.forecastDetails = err;
        })
    }

    getforecastWeather();
}

WeatherForecastController.$inject = ['$scope', 'ForecastWeatherService', 'CommonWeatherService'];

angular.module('weather').controller('WeatherForecastController', WeatherForecastController);

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

        DashboardService.setNewContact(newUser);
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

const topNavLogout = {
    templateUrl: './app/common/top-nav/top-nav-logout/top-nav-logout.html'
};

angular.module('root').component('topNavLogout', topNavLogout);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhcHAucm91dGVzLmpzIiwiY29tbW9uL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LmpzIiwiY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2LmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC5tb2R1bGUuanMiLCJjb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQuc2VydmljZS5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLm1vZHVsZS5qcyIsImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vYXV0aGVudGljYXRpb24ubW9kdWxlLmpzIiwiY29tcG9uZW50cy9tY28vbWNvLm1vZHVsZS5qcyIsImNvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQtY2FyZHMvZGFzaGJvYXJkLWNhcmRzLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jYXJkcy9kYXNoYm9hcmQtY2FyZHMuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLWZvcmVjYXN0L3dlYXRoZXItZm9yZWNhc3QuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItZm9yZWNhc3Qvd2VhdGhlci1mb3JlY2FzdC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItc2VydmljZXMvY29tbW9uLXdlYXRoZXIuc2VydmljZS5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLXNlcnZpY2VzL2N1cnJlbnQtd2VhdGhlci5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItc2VydmljZXMvZm9yZWNhc3Qtd2VhdGhlci5zZXJ2aWNlLmpzIiwiY29tcG9uZW50cy93ZWF0aGVyL3dlYXRoZXItZGFzaGJvYXJkL3dlYXRoZXItZGFzaGJvYXJkLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvd2VhdGhlci93ZWF0aGVyLWRhc2hib2FyZC93ZWF0aGVyLWRhc2hib2FyZC5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXItbmV3L3VzZXItbmV3LmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvdXNlci91c2VyLW5ldy91c2VyLW5ldy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy91c2VyL3VzZXJzL3VzZXJzLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvdXNlci91c2Vycy91c2Vycy5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2xvZ2luL2xvZ2luLmNvbnRyb2xsZXIuanMiLCJjb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ291dC90b3AtbmF2LWxvZ291dC5jb21wb25lbnQuanMiLCJjb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUvYWN0aW9uLXRhYmxlLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS9hY3Rpb24tdGFibGUuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUuY29tcG9uZW50LmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlL2FjdGlvbi10YWJsZS1pdGVtcy1jb2xsYXBzaWJsZS5jb250cm9sbGVyLmpzIiwiY29tcG9uZW50cy9tY28vYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC9hY3Rpb24tdGFibGUtaXRlbXMtbm9ybWFsLmNvbXBvbmVudC5qcyIsImNvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwvYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQ0FBO0FDQUE7QUFDQTtBQ0RBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3Jvb3QnLCBbXHJcbiAgICAnbmdSb3V0ZScsXHJcbiAgICAnZGFzaGJvYXJkJyxcclxuICAgICd1c2VyJyxcclxuICAgICdhdXRoZW50aWNhdGlvbicsXHJcbiAgICAnbWNvJyxcclxuICAgICd3ZWF0aGVyJ1xyXG5dKTtcclxuXHJcbiIsImZ1bmN0aW9uIHJvdXRlUHJvdmlkZXIoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxvZ2luPjwvbG9naW4+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy91c2VyL25ldycsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8dXNlci1uZXc+PC91c2VyLW5ldz4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3VzZXJzJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzx1c2Vycz48L3VzZXJzPidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvZGFzaGJvYXJkJywge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkYXNoYm9hcmQtY2FyZHM+PC9kYXNoYm9hcmQtY2FyZHM+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9sb2dvdXQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxvZ2luPjwvbG9naW4+J1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9hY3Rpb24tdGFibGUnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGFjdGlvbi10YWJsZT48L2FjdGlvbi10YWJsZT4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL3dlYXRoZXInLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHdlYXRoZXItZGFzaGJvYXJkPjwvd2VhdGhlci1kYXNoYm9hcmQ+J1xyXG4gICAgICAgIH0pO1xyXG59XHJcbnJvdXRlUHJvdmlkZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290JykuY29uZmlnKHJvdXRlUHJvdmlkZXIpO1xyXG4iLCJjb25zdCBmb290ZXJDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybCA6ICcuL2FwcC9jb21tb24vZm9vdGVyL2Zvb3Rlci5odG1sJ1xyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgnZm9vdGVyQ29tcG9uZW50JywgZm9vdGVyQ29tcG9uZW50KTtcclxuIiwiY29uc3Qgc2lkZU5hdiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tbW9uL3NpZGUtbmF2L3NpZGUtbmF2Lmh0bWwnXHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLmNvbXBvbmVudCgnc2lkZU5hdicsIHNpZGVOYXYpO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkJywgW10pOyIsImZ1bmN0aW9uIERhc2hib2FyZFNlcnZpY2UoKSB7XHJcbiAgICB0aGlzLmRlZmF1bHRDb250YWN0cyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkFuaWwgVmlzaHZrYXJtYVwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiYW5pbC52aXNodmthcm1hQGpjaS5jb21cIixcclxuICAgICAgICAgICAgXCJtb2JpbGVcIjogXCI5NzEzNDQ4NjRcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiSm9obnNvbiBDb250cm9scyBJbmRpYSBQdnQuIEx0ZC5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiQWtzaGF5IFNvbmlcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImFrc2hheS5zb25pQGdtYWlsLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3NTM2MzI3MjdcIixcclxuICAgICAgICAgICAgXCJjb21wYW55XCI6IFwiSW1wZXR1cyBMaW1pdGVkXCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwibWFsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkVseXNlIEhvYnNvblwiLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IFwiZWx5c2UuaG9ic29uQGJhcmNsYXlzLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJCYXJjbGF5cyBUZWNobm9sb2d5XCIsXHJcbiAgICAgICAgICAgIFwiZ2VuZGVyXCI6IFwiZmVtYWxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiRGVlcGFrIEFoaXJ3YWxcIixcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBcImRlZXBhay5haGlyd2FsQGNnLmNvbVwiLFxyXG4gICAgICAgICAgICBcIm1vYmlsZVwiOiBcIjk3MTM0NDg2NFwiLFxyXG4gICAgICAgICAgICBcImNvbXBhbnlcIjogXCJDb2duaXplbnQgVGVjaG5vbG9neS5cIixcclxuICAgICAgICAgICAgXCJnZW5kZXJcIjogXCJtYWxlXCJcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMuZ2V0RGVmYXVsdENvbnRhY3RzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRDb250YWN0cztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldE5ld0NvbnRhY3QgPSBmdW5jdGlvbiAobmV3Q29udGFjdCkge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdENvbnRhY3RzLnB1c2gobmV3Q29udGFjdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290Jykuc2VydmljZSgnRGFzaGJvYXJkU2VydmljZScsIERhc2hib2FyZFNlcnZpY2UpO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2VhdGhlcicsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgndXNlcicsIFtdKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXV0aGVudGljYXRpb24nLCBbXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdtY28nLCBbXSk7IiwiY29uc3QgdG9wTmF2TG9naW4gPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbW1vbi90b3AtbmF2L3RvcC1uYXYtbG9naW4vdG9wLW5hdi1sb2dpbi5odG1sJ1xyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3RvcE5hdkxvZ2luJywgdG9wTmF2TG9naW4pOyIsImNvbnN0IGRhc2hib2FyZENhcmRzID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQtY2FyZHMvZGFzaGJvYXJkLWNhcmRzLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyXHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdkYXNoYm9hcmQnKS5jb21wb25lbnQoJ2Rhc2hib2FyZENhcmRzJywgZGFzaGJvYXJkQ2FyZHMpO1xyXG4iLCJmdW5jdGlvbiBEYXNoYm9hcmRDYXJkc0NvbnRyb2xsZXIoRGFzaGJvYXJkU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjdHJsLnVzZXJzID0gRGFzaGJvYXJkU2VydmljZS5nZXREZWZhdWx0Q29udGFjdHMoKTtcclxufVxyXG5cclxuRGFzaGJvYXJkQ2FyZHNDb250cm9sbGVyLiRpbmplY3QgPSBbJ0Rhc2hib2FyZFNlcnZpY2UnXVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZCcpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZENhcmRzQ29udHJvbGxlcicsIERhc2hib2FyZENhcmRzQ29udHJvbGxlcik7IiwiY29uc3Qgd2VhdGhlckZvcmVjYXN0ID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3dlYXRoZXIvd2VhdGhlci1mb3JlY2FzdC93ZWF0aGVyLWZvcmVjYXN0Lmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogV2VhdGhlckZvcmVjYXN0Q29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3dlYXRoZXInKS5jb21wb25lbnQoJ3dlYXRoZXJGb3JlY2FzdCcsIHdlYXRoZXJGb3JlY2FzdCk7XHJcbiIsImZ1bmN0aW9uIFdlYXRoZXJGb3JlY2FzdENvbnRyb2xsZXIoJHNjb3BlLCBGb3JlY2FzdFdlYXRoZXJTZXJ2aWNlLCBDb21tb25XZWF0aGVyU2VydmljZSkge1xyXG4gICAgdmFyIGN0cmwgPSB0aGlzO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldGZvcmVjYXN0V2VhdGhlcigpIHtcclxuICAgICAgICBjb25zdCBjaXR5TmFtZSA9IENvbW1vbldlYXRoZXJTZXJ2aWNlLmdldFdlYXRoZXJDaXR5TmFtZSgpO1xyXG4gICAgICAgIHJldHVybiBGb3JlY2FzdFdlYXRoZXJTZXJ2aWNlLmdldFdlYXRoZXJGb3JlY2FzdChjaXR5TmFtZSkudGhlbihmb3JlY2FzdFJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgY3RybC5mb3JlY2FzdERldGFpbHMgPSBmb3JlY2FzdFJlc3BvbnNlO1xyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIGN0cmwuZm9yZWNhc3REZXRhaWxzID0gZXJyO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Zm9yZWNhc3RXZWF0aGVyKCk7XHJcbn1cclxuXHJcbldlYXRoZXJGb3JlY2FzdENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZvcmVjYXN0V2VhdGhlclNlcnZpY2UnLCAnQ29tbW9uV2VhdGhlclNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd3ZWF0aGVyJykuY29udHJvbGxlcignV2VhdGhlckZvcmVjYXN0Q29udHJvbGxlcicsIFdlYXRoZXJGb3JlY2FzdENvbnRyb2xsZXIpO1xyXG4iLCJmdW5jdGlvbiBDb21tb25XZWF0aGVyU2VydmljZSgpIHtcclxuICAgIHRoaXMuY2l0eVRvVXNlID0gJ1B1bmUnO1xyXG5cclxuICAgIHRoaXMuc2V0V2VhdGhlckNpdHlOYW1lID0gZnVuY3Rpb24gKGNpdHlOYW1lKSB7XHJcbiAgICAgICAgdGhpcy5jaXR5VG9Vc2UgPSBjaXR5TmFtZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFdlYXRoZXJDaXR5TmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaXR5VG9Vc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd3ZWF0aGVyJykuc2VydmljZSgnQ29tbW9uV2VhdGhlclNlcnZpY2UnLCBDb21tb25XZWF0aGVyU2VydmljZSk7XHJcbiIsImZ1bmN0aW9uIGhhbmRsZUVycm9yUmVzcG9uc2Uoc3RhdHVzQ29kZSkge1xyXG4gICAgbGV0IGVycm9yUmVzcG9uc2UgPSB7fTtcclxuXHJcbiAgICBzd2l0Y2ggKHN0YXR1c0NvZGUpIHtcclxuICAgICAgICBjYXNlIDIwMDpcclxuICAgICAgICAgICAgZXJyb3JSZXNwb25zZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGVycm9yUmVzcG9uc2UuZXJyb3JNZXNzYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgNDAwOlxyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmVycm9yTWVzc2FnZSA9ICdZb3UgaGF2ZSBwcm92aWRlZCBpbnZhbGlkIGlucHV0LiBQbGVhc2UgZW50ZXIgdmFsaWQgY2l0eSBuYW1lIHRvIHNlYXJjaCEhJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgNDA0OlxyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmVycm9yTWVzc2FnZSA9ICdUaGlzIGNpdHkgZG9lcyBub3QgZXhpc3QhJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgNTAwOlxyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICBlcnJvclJlc3BvbnNlLmVycm9yTWVzc2FnZSA9ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InO1xyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVycm9yUmVzcG9uc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAoIXJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JSZXNwb25zZSA9IHtcclxuICAgICAgICAgICAgaXNFcnJvcjogdHJ1ZSxcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIldlYXRoZXIgcmVzcG9uc2UgaXMgbm90IHJlc3BvbmRpbmcuIFBsZWFzZSB0cnkgYWdhaW4gYWZ0ZXIgc29tZSB0aW1lLlwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGVycm9yUmVzcG9uc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhhbmRsZUVycm9yUmVzcG9uc2UocmVzcG9uc2Uuc3RhdHVzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlcGFyZVdlYXRoZXJSZXNwb25zZShyZXNwb25zZURhdGEpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRXZWF0aGVyRGF0YSA9IHtcclxuICAgICAgICBpc0Vycm9yOiBmYWxzZSxcclxuICAgICAgICBjaXR5OiByZXNwb25zZURhdGEubG9jYXRpb24ubmFtZSxcclxuICAgICAgICBzdGF0ZTogcmVzcG9uc2VEYXRhLmxvY2F0aW9uLnJlZ2lvbixcclxuICAgICAgICBjb3VudHJ5OiByZXNwb25zZURhdGEubG9jYXRpb24uY291bnRyeSxcclxuICAgICAgICBsb2NhbFRpbWU6IHJlc3BvbnNlRGF0YS5sb2NhdGlvbi5sb2NhbHRpbWUsXHJcbiAgICAgICAgdGVtcF9jOiBNYXRoLnJvdW5kKHJlc3BvbnNlRGF0YS5jdXJyZW50LnRlbXBfYyksXHJcbiAgICAgICAgdGVtcF9mOiBNYXRoLnJvdW5kKHJlc3BvbnNlRGF0YS5jdXJyZW50LnRlbXBfZiksXHJcbiAgICAgICAgZmVlbHNsaWtlX2M6IHJlc3BvbnNlRGF0YS5jdXJyZW50LmZlZWxzbGlrZV9jLFxyXG4gICAgICAgIGh1bWlkaXR5OiByZXNwb25zZURhdGEuY3VycmVudC5odW1pZGl0eSxcclxuICAgICAgICBwcmVzc3VyZTogcmVzcG9uc2VEYXRhLmN1cnJlbnQucHJlc3N1cmVfbWIsXHJcbiAgICAgICAgY2xvdWRfc3RhdGU6IHJlc3BvbnNlRGF0YS5jdXJyZW50LmNvbmRpdGlvbi50ZXh0LFxyXG4gICAgICAgIGNsb3VkX2ljb246IHJlc3BvbnNlRGF0YS5jdXJyZW50LmNvbmRpdGlvbi5pY29uXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBjdXJyZW50V2VhdGhlckRhdGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEN1cnJlbnRXZWF0aGVyU2VydmljZSgkaHR0cCwgJHEpIHtcclxuICAgIHRoaXMuZ2V0V2VhdGhlckRldGFpbHMgPSBmdW5jdGlvbiAoY2l0eSkge1xyXG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICBjb25zdCB3ZWF0aGVyX2FwaSA9IGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9jdXJyZW50Lmpzb24/a2V5PWYyOWVjMjE2ZmUwZjRlNGRhNWY2NTYzMjIwMzAwNCZxPSR7Y2l0eX1gO1xyXG5cclxuICAgICAgICAkaHR0cCh7IG1ldGhvZDogJ0dFVCcsIHVybDogd2VhdGhlcl9hcGkgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZVN0YXR1cyA9IGhhbmRsZVJlc3BvbnNlKHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VTdGF0dXMuaXNFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2VTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHByZXBhcmVXZWF0aGVyUmVzcG9uc2UocmVzcG9uc2UuZGF0YSkpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNFcnJvcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVyci5kYXRhLmVycm9yLm1lc3NhZ2VcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH1cclxufVxyXG5cclxuQ3VycmVudFdlYXRoZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRxJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncm9vdCcpLnNlcnZpY2UoJ0N1cnJlbnRXZWF0aGVyU2VydmljZScsIEN1cnJlbnRXZWF0aGVyU2VydmljZSk7XHJcbiIsImZ1bmN0aW9uIHByZXBhcmVXZWF0aGVyRm9yZWNhc3RSZXNwb25zZShyZXNwb25zZURhdGEpIHtcclxuICAgIGNvbnN0IGZvcmVjYXN0RGF5cyA9IHJlc3BvbnNlRGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheTtcclxuICAgIGNvbnN0IGZvcmVjYXN0TGlzdCA9IFtdO1xyXG5cclxuICAgIGZvcmVjYXN0RGF5cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGxldCBmb3JlY2FzdERhdGEgPSB7XHJcbiAgICAgICAgICAgIHRlbXBfaGlnaDogZWxlbWVudC5kYXkubWF4dGVtcF9jLFxyXG4gICAgICAgICAgICB0ZW1wX2xvdzogZWxlbWVudC5kYXkubWludGVtcF9jLFxyXG4gICAgICAgICAgICBjbG91ZF9pY29uOiBlbGVtZW50LmRheS5jb25kaXRpb24uaWNvbixcclxuICAgICAgICAgICAgZGF0ZV9tb250aDogZWxlbWVudC5kYXRlLFxyXG4gICAgICAgICAgICBjbG91ZF9zdGF0ZTogZWxlbWVudC5kYXkuY29uZGl0aW9uLnRleHRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmb3JlY2FzdExpc3QucHVzaChmb3JlY2FzdERhdGEpO1xyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gZm9yZWNhc3RMaXN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb3JlY2FzdFdlYXRoZXJTZXJ2aWNlKCRodHRwLCAkcSkge1xyXG4gICAgdGhpcy5nZXRXZWF0aGVyRm9yZWNhc3QgPSBmdW5jdGlvbiAoY2l0eSkge1xyXG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICBjb25zdCB3ZWF0aGVyX2FwaSA9IGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP2tleT1mMjllYzIxNmZlMGY0ZTRkYTVmNjU2MzIyMDMwMDQmcT0ke2NpdHl9JmRheXM9M2A7XHJcblxyXG4gICAgICAgICRodHRwKHsgbWV0aG9kOiAnR0VUJywgdXJsOiB3ZWF0aGVyX2FwaSB9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRXJyb3I6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJXZWF0aGVyIHJlc3BvbnNlIGlzIG5vdCByZXNwb25kaW5nLiBQbGVhc2UgdHJ5IGFnYWluIGFmdGVyIHNvbWUgdGltZS5cIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZXJyb3JSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocHJlcGFyZVdlYXRoZXJGb3JlY2FzdFJlc3BvbnNlKHJlc3BvbnNlLmRhdGEpKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRXJyb3I6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnIuZGF0YS5lcnJvci5tZXNzYWdlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbkZvcmVjYXN0V2VhdGhlclNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyb290Jykuc2VydmljZSgnRm9yZWNhc3RXZWF0aGVyU2VydmljZScsIEZvcmVjYXN0V2VhdGhlclNlcnZpY2UpO1xyXG4iLCJjb25zdCB3ZWF0aGVyRGFzaGJvYXJkID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3dlYXRoZXIvd2VhdGhlci1kYXNoYm9hcmQvd2VhdGhlci1kYXNoYm9hcmQuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBXZWF0aGVyRGFzaGJvYXJkQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3dlYXRoZXInKS5jb21wb25lbnQoJ3dlYXRoZXJEYXNoYm9hcmQnLCB3ZWF0aGVyRGFzaGJvYXJkKTtcclxuXHJcbiIsImZ1bmN0aW9uIFdlYXRoZXJEYXNoYm9hcmRDb250cm9sbGVyKCRzY29wZSwgQ3VycmVudFdlYXRoZXJTZXJ2aWNlLCBDb21tb25XZWF0aGVyU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICAkc2NvcGUuY2l0eVNlbGVjdGVkID0gJyc7XHJcbiAgICAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDaXR5V2hlYXRoZXIoKSB7XHJcbiAgICAgICAgY29uc3QgY2l0eU5hbWUgPSBDb21tb25XZWF0aGVyU2VydmljZS5nZXRXZWF0aGVyQ2l0eU5hbWUoKTtcclxuICAgICAgICByZXR1cm4gQ3VycmVudFdlYXRoZXJTZXJ2aWNlLmdldFdlYXRoZXJEZXRhaWxzKGNpdHlOYW1lKS50aGVuKGN1cnJlbnRXZWF0aGVyUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBjdHJsLndoZWF0aGVyUmVzcG9uc2UgPSBjdXJyZW50V2VhdGhlclJlc3BvbnNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgY3RybC53aGVhdGhlclJlc3BvbnNlID0gZXJyO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3RybC5nZXRXZWF0aGVyRm9yQ2l0eVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIENvbW1vbldlYXRoZXJTZXJ2aWNlLnNldFdlYXRoZXJDaXR5TmFtZSgkc2NvcGUuY2l0eVNlbGVjdGVkKTtcclxuICAgICAgICAkc2NvcGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZ2V0Q2l0eVdoZWF0aGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2l0eVdoZWF0aGVyKCk7XHJcbn1cclxuXHJcbldlYXRoZXJEYXNoYm9hcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdDdXJyZW50V2VhdGhlclNlcnZpY2UnLCAnQ29tbW9uV2VhdGhlclNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd3ZWF0aGVyJykuY29udHJvbGxlcignV2VhdGhlckRhc2hib2FyZENvbnRyb2xsZXInLCBXZWF0aGVyRGFzaGJvYXJkQ29udHJvbGxlcik7XHJcbiIsImNvbnN0IHVzZXJOZXcgPSB7XHJcbiAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3VzZXIvdXNlci1uZXcvdXNlci1uZXcuaHRtbCcsXHJcbiAgY29udHJvbGxlcjogVXNlck5ld0NvbnRyb2xsZXIsXHJcbiAgYmluZGluZ3M6IHtcclxuICAgIHVzZXI6ICc8J1xyXG4gIH1cclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb21wb25lbnQoJ3VzZXJOZXcnLCB1c2VyTmV3KTtcclxuIiwiZnVuY3Rpb24gVXNlck5ld0NvbnRyb2xsZXIoRGFzaGJvYXJkU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBcclxuICAgIGN0cmwudXNlciA9IHt9O1xyXG5cclxuICAgIGN0cmwubmV3VXNlciA9IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgaWYgKCF1c2VyIHx8ICF1c2VyLmZpcnN0TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdVc2VyID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBgJHt1c2VyLmZpcnN0TmFtZX0gJHt1c2VyLmxhc3ROYW1lfWAsXHJcbiAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBtb2JpbGU6IHVzZXIubW9iaWxlLFxyXG4gICAgICAgICAgICBjb21wYW55OiB1c2VyLmNvbXBhbnksXHJcbiAgICAgICAgICAgIGdlbmRlcjogdXNlci5nZW5kZXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBEYXNoYm9hcmRTZXJ2aWNlLnNldE5ld0NvbnRhY3QobmV3VXNlcik7XHJcbiAgICAgICAgY3RybC51c2VyID0ge307XHJcbiAgICB9XHJcbn1cclxuXHJcblVzZXJOZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJ0Rhc2hib2FyZFNlcnZpY2UnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29udHJvbGxlcignVXNlck5ld0NvbnRyb2xsZXInLCBVc2VyTmV3Q29udHJvbGxlcik7XHJcbiIsImNvbnN0IHVzZXJzID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL3VzZXIvdXNlcnMvdXNlcnMuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBVc2Vyc0NvbnRyb2xsZXJcclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2VyJykuY29tcG9uZW50KCd1c2VycycsIHVzZXJzKTtcclxuIiwiZnVuY3Rpb24gVXNlcnNDb250cm9sbGVyKCRzY29wZSwgRGFzaGJvYXJkU2VydmljZSkge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjdHJsLnVzZXJzID0gRGFzaGJvYXJkU2VydmljZS5nZXREZWZhdWx0Q29udGFjdHMoKTtcclxuXHJcbiAgICBjdHJsLm9yZGVyQnlTZWxlY3RlZFZhbHVlID0gJ25hbWUnO1xyXG5cclxuICAgIGN0cmwub3JkZXJCeVZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBjdHJsLm9yZGVyQnlTZWxlY3RlZFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblVzZXJzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRGFzaGJvYXJkU2VydmljZSddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3VzZXInKS5jb250cm9sbGVyKCdVc2Vyc0NvbnRyb2xsZXInLCBVc2Vyc0NvbnRyb2xsZXIpO1xyXG4iLCJjb25zdCBsb2dpbiA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlclxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29tcG9uZW50KCdsb2dpbicsIGxvZ2luKTtcclxuIiwiZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRsb2NhdGlvbikge1xyXG4gICAgY29uc3QgY3RybCA9IHRoaXM7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9ICdhbmlsJztcclxuICAgIGNvbnN0IHBhc3N3b3JkID0gJ0luZGlhQDEyMyc7XHJcbiAgICBsZXQgaXNMb2dpbkZhaWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGN0cmwubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICBpZiAoY3JlZGVudGlhbHMgJiYgY3JlZGVudGlhbHMudXNlcm5hbWUgPT09IHVzZXJuYW1lICYmIGNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSBwYXNzd29yZCkge1xyXG4gICAgICAgICAgICBpc0xvZ2luRmFpbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2dpbicsIHRydWUpO1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Rhc2hib2FyZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpc0xvZ2luRmFpbGVkID0gdHJ1ZTtcclxuICAgICAgICBjdHJsLmxvZ2luU3RhdHVzID0gaXNMb2dpbkZhaWxlZDtcclxuICAgICAgICBjdHJsLmxvZ2luRXJyb3JNZXNzYWdlID0gJ0ludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQhJztcclxuICAgIH1cclxufVxyXG5cclxuTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGhlbnRpY2F0aW9uJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTtcclxuIiwiY29uc3QgdG9wTmF2TG9nb3V0ID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21tb24vdG9wLW5hdi90b3AtbmF2LWxvZ291dC90b3AtbmF2LWxvZ291dC5odG1sJ1xyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3Jvb3QnKS5jb21wb25lbnQoJ3RvcE5hdkxvZ291dCcsIHRvcE5hdkxvZ291dCk7IiwiY29uc3QgYWN0aW9uVGFibGUgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS9hY3Rpb24tdGFibGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBBY3Rpb25UYWJsZUNvbnRyb2xsZXJcclxufTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb21wb25lbnQoJ2FjdGlvblRhYmxlJywgYWN0aW9uVGFibGUpO1xyXG4iLCJmdW5jdGlvbiBBY3Rpb25UYWJsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuXHJcbiAgICBjdHJsLm1jb09iamVjdERldGFpbHMgPSB7XHJcbiAgICAgICAgc3RhdGVzVGV4dDogJ1N0YXRlcycsXHJcbiAgICAgICAgbm9PZlN0YXRlczogNCxcclxuICAgICAgICByZWxpbnF1aXNoRGVmYXVsdDogJ1N0YXRlIDAnXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zaG93Q29sbGFwc2libGVBY3Rpb25UYWJsZSA9IHRydWU7XHJcbiAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gZmFsc2U7XHJcblxyXG4gICAgY3RybC5zaG93Q29sbGFwc2libGVUYWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5zaG93Tm9ybWFsQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLnNob3dOb3JtYWxUYWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd05vcm1hbEFjdGlvblRhYmxlID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvbGxhcHNpYmxlQWN0aW9uVGFibGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjdHJsLm1jb1N0YXRlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDEwJyxcclxuICAgICAgICAgICAgc3RhdHVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzdGF0ZUF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQVYwMScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ09uJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06ICdCVjAxJyxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAnT2ZmJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcyMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXRlTmFtZTogJ1N0YXRlIDIwJyxcclxuICAgICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogJ0FWMTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdDb29saW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogJzE2IChEZWZhdWx0KScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6ICcxMDAgU2Vjb25kcydcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiAnQlYyMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ0hlYXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnMTYgKERlZmF1bHQpJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogJzIwMCBTZWNvbmRzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XHJcblxyXG5BY3Rpb25UYWJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29udHJvbGxlcignQWN0aW9uVGFibGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVDb250cm9sbGVyKTtcclxuIiwiY29uc3QgYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlID0ge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL21jby9hY3Rpb24tdGFibGUtaXRlbXMtY29sbGFwc2libGUvYWN0aW9uLXRhYmxlLWl0ZW1zLWNvbGxhcHNpYmxlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcixcclxuICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgaXRlbXM6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ21jbycpLmNvbXBvbmVudCgnYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlJywgYWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlKTtcclxuXHJcbiIsImZ1bmN0aW9uIEFjdGlvblRhYmxlSXRlbXNDb2xsYXBzaWJsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICBjb25zdCBjdHJsID0gdGhpcztcclxuXHJcbiAgICAkc2NvcGUuaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICBjdHJsLnRvZ2dsZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmlzRXhwYW5kZWQgPSAhKCRzY29wZS5pc0V4cGFuZGVkKTtcclxuICAgIH1cclxufVxyXG5cclxuQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb250cm9sbGVyKCdBY3Rpb25UYWJsZUl0ZW1zQ29sbGFwc2libGVDb250cm9sbGVyJywgQWN0aW9uVGFibGVJdGVtc0NvbGxhcHNpYmxlQ29udHJvbGxlcik7XHJcbiIsImNvbnN0IGFjdGlvblRhYmxlSXRlbXNOb3JtYWwgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvbWNvL2FjdGlvbi10YWJsZS1pdGVtcy1ub3JtYWwvYWN0aW9uLXRhYmxlLWl0ZW1zLW5vcm1hbC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBpdGVtczogJzwnXHJcbiAgICB9XHJcbn07XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbWNvJykuY29tcG9uZW50KCdhY3Rpb25UYWJsZUl0ZW1zTm9ybWFsJywgYWN0aW9uVGFibGVJdGVtc05vcm1hbCk7XHJcblxyXG4iLCJmdW5jdGlvbiBBY3Rpb25UYWJsZUl0ZW1zTm9ybWFsQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xyXG4gICBcclxuICAgICRzY29wZS5pc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGN0cmwudG9nZ2xlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuaXNFeHBhbmRlZCA9ICEoJHNjb3BlLmlzRXhwYW5kZWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BY3Rpb25UYWJsZUl0ZW1zTm9ybWFsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdtY28nKS5jb250cm9sbGVyKCdBY3Rpb25UYWJsZUl0ZW1zTm9ybWFsQ29udHJvbGxlcicsIEFjdGlvblRhYmxlSXRlbXNOb3JtYWxDb250cm9sbGVyKTtcclxuIl19
