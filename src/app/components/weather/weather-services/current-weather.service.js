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
