function SideNavController(WheatherService) {
    const ctrl = this;

    const existingData = JSON.parse(localStorage.getItem('wheather'));

    console.log(existingData);

    if (existingData) {
        ctrl.wheatherData = existingData;
        return;
    }

    WheatherService.getWheatherDetails()
        .then(data => {
            ctrl.wheatherData = data;
            localStorage.setItem('wheather', JSON.stringify(data));
        }).catch(err => {
            console.log("Wheather API Error : ", err);
            ctrl.errorMessage = err;
        })
}

SideNavController.$inject = ['WheatherService'];

angular.module('root').controller('SideNavController', SideNavController);