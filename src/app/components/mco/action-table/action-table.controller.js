function ActionTableController($scope) {
    const ctrl = this;

    ctrl.mcoObjectDetails = {
        statesText: 'States',
        noOfStates: 4,
        relinquishDefault: 'State 0'
    };

    $scope.showCollapsibleActionTable = true;
    $scope.showNormalActionTable = false;

    ctrl.showCollapsibleTable = function () {
        $scope.showCollapsibleActionTable = true;
        $scope.showNormalActionTable = false;
    }

    ctrl.showNormalTable = function () {
        $scope.showNormalActionTable = true;
        $scope.showCollapsibleActionTable = false;
    }

    ctrl.mcoStates = [
        {
            stateName: 'State 10',
            status: true,
            stateAttributes: [
                {
                    item: 'AV01',
                    command: 'On',
                    priority: '16 (Default)',
                    delay: '10 Seconds'
                }, {
                    item: 'BV01',
                    command: 'Off',
                    priority: '16 (Default)',
                    delay: '20 Seconds'
                }
            ]
        },
        {
            stateName: 'State 20',
            stateAttributes: [
                {
                    item: 'AV10',
                    command: 'Cooling',
                    priority: '16 (Default)',
                    delay: '100 Seconds'
                }, {
                    item: 'BV20',
                    command: 'Heating',
                    priority: '16 (Default)',
                    delay: '200 Seconds'
                }
            ]
        }
    ]
}

ActionTableController.$inject = ['$scope'];

angular.module('mco').controller('ActionTableController', ActionTableController);
