function addController($scope) {
    $scope.model = { year: '2014', currency: 'Rs.', total: '65,000.00' }
    
    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
addController.$inject = ['$scope'];