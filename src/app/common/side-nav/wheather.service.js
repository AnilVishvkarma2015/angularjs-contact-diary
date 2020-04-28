function WheatherService($http, $q) {
    this.getWheatherDetails = function () {
        const deferred = $q.defer();

        $http({ method: 'GET', url: 'http://api.weatherstack.com/current?access_key=db8c7f80c551e966d8e07faec78cfe47&query=Pune' })
            .then(function (response) {
                if (response.status !== 200) {
                    const errorMessage = "Wheather response is not in 200 status code. Please try again after some time."
                    deferred.resolve(errorMessage);
                    return;
                }

                const responseData = response.data;

                let wheatherData = {
                    city: responseData.location.name,
                    state: responseData.location.region,
                    country: responseData.location.country,
                    temp: responseData.current.temperature,
                    pressure: responseData.current.pressure,
                    wind: responseData.current.wind_speed,
                    cloudState: responseData.current.weather_descriptions[0]
                };
                
                deferred.resolve(wheatherData);
            }, function (err) {
                console.log(err);
                deferred.reject(err);
            });

        return deferred.promise;
    }
}

WheatherService.$inject = ['$http', '$q'];

angular.module('root').service('WheatherService', WheatherService);

