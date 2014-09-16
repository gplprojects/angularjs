function loginController($scope) {
    
    $scope.doPrepareRequest = function (options) {
        
        options.params = options.data;
        return options.data;
    }

    $scope.doParseResponse = function (data, ops, hasError) {
        
    }

    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
loginController.$inject = ['$scope'];