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
