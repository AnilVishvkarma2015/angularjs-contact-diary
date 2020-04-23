const sideNav = {
    templateUrl: './app/common/side-nav/side-nav.html',
    controller: SideNavController,
    bindings: {
        user: '<'
    }
};

angular.module('root').component('sideNav', sideNav);

