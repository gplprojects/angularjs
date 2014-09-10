function loginController($scope) {
    
    $scope.doPrepareRequest = function (options) {
        
    
        //To Do: Write req 
        return options.data; //Don't use generic functionality
    }

    $scope.doParseResponse = function (data, ops, hasError) {
        console.log("Indise addController's responseHandler");
    }

    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
loginController.$inject = ['$scope'];