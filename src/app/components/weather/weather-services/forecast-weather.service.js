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