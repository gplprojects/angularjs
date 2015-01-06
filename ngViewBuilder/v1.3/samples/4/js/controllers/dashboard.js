function dashboardController($scope) {
    
    this.$init($scope); //, $scope.initDashboard);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
dashboardController.$inject = ['$scope'];