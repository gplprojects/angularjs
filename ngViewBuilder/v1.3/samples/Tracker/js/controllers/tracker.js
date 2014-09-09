function trackerController($scope) {
    $scope[$scope.id] = {};

    this.loadModel = function () {
        /*var response = {
            currency: 'Rs.',
            categories: [
                        { id: 'cat0', color: '#717ED2', desc: 'General' },
                        { id: 'cat1', color: '#90ed7d', desc: 'Food' }
            ],
            expenses: [
                        { id: 'e0', notes: 'Project spent', amount: 10000.00, category: 'cat0', on: '12/07/2014' },
                        { id: 'e1', notes: 'Dinner', amount: 1000.00, category: 'cat1', on: '13/07/2014' },
                        { id: 'e2', notes: 'Petrol', amount: 2500.00, category: 'cat0', on: '13/07/2014' },
                        { id: 'e3', notes: 'House Rent', amount: 12000.00, category: 'cat1', on: '12/07/2014' }
            ]
        }*/
        var response = JSON.parse(localStorage.getItem('expense'));

        //copy response to model
        $scope.model = angular.extend({}, response);
        if (!$scope.model.categories)
            $scope.model.categories = [];

        if (!$scope.model.expenses)
            $scope.model.expenses = [];
        $scope.model.total = 0.00;
        $scope.model.year = (new Date()).getFullYear();
        for (var i = 0; i < $scope.model.expenses.length; i++) {
            $scope.model.total += (parseFloat($scope.model.expenses[i].amount) || 0);
        }

        this.$init($scope);
    }

    $scope.beforeRender = function (elName, meta, config, options) {
        switch(elName) {
            case "highchart1":
                var series = [], xaxiscategories = [];

                //Generate date wise sum for category
                var data = {};
                for (var i = 0; i < $scope.model.expenses.length; i++) {
                    var expense = $scope.model.expenses[i];

                    if (!data[expense.on])
                        data[expense.on] = {};
                    if (!data[expense.on][expense.category])
                        data[expense.on][expense.category] = {};

                    data[expense.on][expense.category].total = data[expense.on][expense.category].total ? data[expense.on][expense.category].total + expense.amount : expense.amount;
                }

                //generate xAxis category
                angular.forEach(data, function (obj, date) {
                    xaxiscategories.push(date);
                });
                
                //generate series
                angular.forEach($scope.model.categories, function (category, categoryName) {
                    
                    var values = [];
                    angular.forEach(data, function (obj, date) {
                        if (data[date][category.id])
                            values.push(data[date][category.id].total);
                        else
                            values.push(0);
                    });

                    series.push({
                        "name": category.desc,
                        "data": values,
                        "id": "series-" + category.id,
                        "type": "column"
                    });
                });
                
                config.xAxis = { categories: xaxiscategories };
                config.series = series;
                break;

            case "overview":
                for (var i = 0; i < $scope.model.expenses.length; i++) {
                    var per = (parseFloat($scope.model.expenses[i].amount) / parseFloat($scope.model.total)) * 100;
                    meta.children['exp-' + i] = {
                                                    content: '<div><span>' + $scope.model.expenses[i].notes + ' </span> <progressbar animate="true" value="' + per + '" type="success"><b>' + $scope.model.expenses[i].amount + '</b></progressbar></div>'
                                                }
                    }
                break;
        }
    }

    $scope.initModule = function () {
        angular.element('.progress-bar-cat1');

    }

    this.loadModel();
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
trackerController.$inject = ['$scope'];