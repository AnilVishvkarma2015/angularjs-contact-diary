function SideNavController(WeatherService) {
    const ctrl = this;

    const existingData = JSON.parse(localStorage.getItem('weather'));

    console.log(existingData);

    if (existingData) {
        ctrl.weatherData = existingData;
        return;
    }

    WeatherService.getWeatherDetails()
        .then(data => {
            ctrl.weatherData = data;
            localStorage.setItem('weather', JSON.stringify(data));
        }).catch(err => {
            console.log("Weather API Error : ", err);
            ctrl.errorMessage = err;
        })
}

SideNavController.$inject = ['WeatherService'];

angular.module('root').controller('SideNavController', SideNavController);