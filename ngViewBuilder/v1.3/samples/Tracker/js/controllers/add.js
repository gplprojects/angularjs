function addController($scope) {
    
    var response = JSON.parse(localStorage.getItem('expense'))
    
    //copy response to model
    $scope.model = angular.copy(response, {});
    
    if (!$scope.model.categories)
        $scope.model.categories = [{id:'', desc: '--Select--', color: '#000'}];

    if (!$scope.model.expenses)
        $scope.model.expenses = [];

    $scope.doPrepareRequest = function (options) {
        
        //To Do: Add date field
        if (!$scope.model.expenseform.category && $scope.model.expenseform.newcategory) {
            $scope.model.expenseform.category = {
                id: 'cat' + $scope.model.categories.length,
                color: '#000',
                desc: $scope.model.expenseform.newcategory
            };
            $scope.model.categories.push($scope.model.expenseform.category);
        }
        if (!$scope.model.expenseform.category || !$scope.model.expenseform.amount)
            return false;

        var dt = $scope.model.expenseform.on || new Date();
        var exp = {
            id: 'exp' + $scope.model.expenses.length,
            notes: $scope.model.expenseform.notes,
            amount: $scope.model.expenseform.amount,
            category: $scope.model.expenseform.category.id,
            on: (dt.getUTCDate() + 1) + '/' + (dt.getUTCMonth() + 1) + '/' + dt.getUTCFullYear()
        };
        delete dt.expenseform;
        $scope.model.expenses.push(exp)
        delete $scope.model.expenseform;

        $scope.model.currency = $scope.model.currency || 'Rs';
        localStorage.setItem('expense', JSON.stringify($scope.model));

        //To Do: Write req 
        return false; //Don't use generic functionality
    }

    $scope.doParseResponse = function (data, ops, hasError) {
        console.log("Indise addController's responseHandler");
    }

    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
addController.$inject = ['$scope'];