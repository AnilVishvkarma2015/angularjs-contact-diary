const weatherForecast = {
    templateUrl: './app/components/weather/weather-forecast/weather-forecast.html',
    controller: WeatherForecastController
};

angular.module('weather').component('weatherForecast', weatherForecast);
