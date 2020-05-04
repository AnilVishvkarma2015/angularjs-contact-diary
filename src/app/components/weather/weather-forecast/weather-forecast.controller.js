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
