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
