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