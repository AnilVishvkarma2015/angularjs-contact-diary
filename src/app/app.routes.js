function routeProvider($routeProvider) {
    $routeProvider
        .when('/', {
            template: '<login></login>'
        })
        .when('/user/new', {
            template: '<user-new></user-new>'
        })
        .when('/users', {
            template: '<users></users>'
        })
        .when('/dashboard', {
            template: '<dashboard-cards></dashboard-cards>'
        })
        .when('/logout', {
            template: '<login></login>'
        })
        .when('/action-table', {
            template: '<action-table></action-table>'
        })
        .when('/weather', {
            template: '<weather-dashboard></weather-dashboard>'
        });
}
routeProvider.$inject = ['$routeProvider'];

angular.module('root').config(routeProvider);
