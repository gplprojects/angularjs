function homeController($scope, $location) {
    
    $scope.doPrepareRequest = function (options) {
        
    
        //To Do: Write req 
        return false; //Don't use generic functionality
    }

    $scope.doParseResponse = function (data, ops, hasError) {
        console.log("Indise addController's responseHandler");
    }

    this.$init($scope);
    //$location.open('#/home/list')
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
homeController.$inject = ['$scope'];