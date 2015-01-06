function overviewController($scope) {
    
    $scope.initDashboard = function () {
        console.log($scope.schema.$metainfo);
        $scope.$doPefromAction(null, 'root_overview', $scope, 'query1', true, false)
    }

    this.$init($scope); //, $scope.initDashboard);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
overviewController.$inject = ['$scope'];