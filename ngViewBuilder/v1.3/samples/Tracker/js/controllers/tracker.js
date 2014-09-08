function trackerController($scope) {
    $scope[$scope.id] = {};

    this.loadModel = function () {
        var response = {
            currency: 'Rs.',
            categories: {
                cat1: { color: '#717ED2', desc: 'General' },
                cat2: { color: '#90ed7d', desc: 'Food' }
            },
            expenses: [
                        { id: 'e001', notes: 'Project spent', amount: 10000.00, category: 'cat1', on: '12/07/2014' },
                        { id: 'e002', notes: 'Dinner', amount: 1000.00, category: 'cat2', on: '13/07/2014' },
                        { id: 'e003', notes: 'Petrol', amount: 2500.00, category: 'cat1', on: '13/07/2014' },
                        { id: 'e004', notes: 'House Rent', amount: 12000.00, category: 'cat1', on: '12/07/2014' }
            ]
        }

        //copy response to model
        $scope.model = angular.extend({}, response);
        $scope.model.total = 0;
        $scope.model.year = (new Date()).getFullYear();
        for (var i = 0; i < $scope.model.expenses.length; i++) {
            $scope.model.total += $scope.model.expenses[i].amount;
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
                        if (data[date][categoryName])
                            values.push(data[date][categoryName].total);
                        else
                            values.push(0);
                    });

                    series.push({
                        "name": category.desc,
                        "data": values,
                        "id": "series-" + categoryName,
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
                                                    //content: '<span>' + $scope.model.expenses[i].notes + ' </span><div class="progress" style="display:block;"><div class="progress-bar" role="progressbar" aria-valuenow="' + per + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + per + '%; background-color:' + $scope.model.categories[$scope.model.expenses[i].category].color + '">' + $scope.model.expenses[i].amount + '</div></div>',
                                                    compile: true,
                                                    content: '<div><span>' + $scope.model.expenses[i].notes + ' </span> <progressbar animate="true" value="' + per + '" type="' + $scope.model.expenses[i].category + '"><b>' + $scope.model.expenses[i].amount + '</b></progressbar></div>'
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