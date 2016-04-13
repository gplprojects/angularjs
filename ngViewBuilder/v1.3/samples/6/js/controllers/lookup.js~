function lookupController($scope, $ngViewBuilder) {

    $scope.model = {
        userQueryText: 'SourceType',
        displayMode: 'raw', /*raw / custom*/
        visualType: '', /* Control Type*/
        controlTypes: supportedControls,
    };

    $scope.changeDisplayMode = function (mode) {
        $scope.model.displayMode = mode || 'raw';
    }

    $scope.doPrepareRequest = function (ops) {
        return;
    }

    function processTheData(data) {
        var arrHits = data.hits.hits;
        var tempArrRawData = [];
        var tempArrTableData = [];
        for (var i = 0; i < arrHits.length; i++) {
            var a = arrHits[i];
            var b = a._source;
            tempArrRawData.push(b.message);
            delete b.message;
            tempArrTableData.push(b);
        }
        var tempDic1 = data.hits.hits[0]._source;
        $scope.terms = Object.keys(tempDic1)
        $scope.events = tempArrRawData;
        $scope.arrayForTableData = tempArrTableData;
    }

    $scope.doParseResponse = function (data, ops, hasError) {
        console.log(data);

        switch (ops.name) {
            case "sourcetypes":
                //this should be set after getting response
                $scope.suggestions = angular.copy(data.aggregations.sourcetypes.buckets)
                $scope.showSuggestion = $scope.suggestions.length ? true : false;
                break;

            case "lookup":
                $scope.showSuggestion = false;
                if (data)
                    processTheData(data);
                break;

            case "table":

        }
    }

    $scope.lookUp = function ($event) {
        var action = null;

        if ($scope.model.userQueryText.length != 0) {
            if ($event.keyCode != 13) {
                var terms = $scope.model.userQueryText.toLowerCase().split('sourcetype');

                if ($scope.model.userQueryText.toLowerCase() == 'sourcetype' || $scope.model.userQueryText.toLowerCase() == 'sourcetype=' || terms[terms.length - 1] == '=' || terms[terms.length - 1] == '') {

                    action = {
                        name: 'sourcetypes',
                        type: 'post',
                        url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
                        data: { "_source": false, "size": 0, "query": { "query_string": { "query": "SourceType:*" } }, "aggs": { "sourcetypes": { "terms": { "field": "SourceType", "size": 0 } } } }
                    }
                }
            }
            else if ($event.keyCode == 13) {
                var sourceTypes = $scope.model.userQueryText.split(' '),
                sourceTypeValues = sourceTypes[0].split('=');
                var data = postTheSearchText(sourceTypes);
                action = {
                    name: data.name,
                    type: 'post',
                    url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
                    data: data.parameter
                }
            }
            else { }
            if (action) {
                $scope.$prepareAndExecute($scope, $event, null, action, action.name);
            }
        }
    }

    $scope.$watch("model.controlType", function (newValue, oldValue) {
        
        if (newValue == oldValue)
            return;

        var controlDef = $scope.model.controlTypes[newValue];
        var controlConfig = null;
        
        switch (controlDef.basetype) {
            case "gridpanel":
                $scope.model.defaultModel = angular.copy($scope.arrayForTableData);
                controlConfig = {
                    compile: true,
                    id: 'default_panel',
                    template: "panel",
                    title: "Table View",
                    children: {
                        default_table: {
                            type: 'gridpanel',
                            template: 'ui-grid',
                            config: { data: 'model.defaultModel' }
                        }
                    }
                }
                break;

            case "mappanel":
                break;

            case "chartpanel":
                break;

            case "formpanel":
                break;

            case "box":
                break;
        }

        angular.element('#user_control_container').html("");
        if (controlConfig) {
            
            $ngViewBuilder.buildControl($scope, controlConfig, angular.element('#user_control_container'), "defaultModel", $scope.model);

            console.log($scope.model.defaultModel);
        }
    });

    $scope.handleChange = function (index, type) {

        switch (type) {
            case "sourcetype":
                $scope.model.userQueryText += $scope.suggestions[index].key;
                break;
        }

        $scope.showSuggestion = false;
    };

    this.$init($scope);


    ////////////////////////////////////////////////////////////////////////////////////
    function postTheSearchText(arrSearchTerms) {
        var data = {};
        data.name = "lookup";
        data.parameter = {};

        var arrSourceTypeTerm = arrSearchTerms[0].split('=');
        if (arrSourceTypeTerm.length > 1) {
            var strSourceType = arrSourceTypeTerm[1];

            //Construct the Query Parameters
            data.parameter.size = 20;
            data.parameter.query = {};
            data.parameter.query.filtered = {};
            data.parameter.query.filtered.filter = {};
            data.parameter.query.filtered.filter.bool = {};
            //Parameter for 'AND' condition
            data.parameter.query.filtered.filter.bool.must = [];
            data.parameter.query.filtered.filter.bool.must.push({ "term": { "SourceType": strSourceType } });//Put the Sourcetype
            //Parameter for 'NOT' condition
            data.parameter.query.filtered.filter.bool.must_not = [];
            //Parameter for 'OR' condition
            data.parameter.query.filtered.filter.bool.should = [];

            //To Do -> Chart Creation
            var chartType = 0;
            var chartParameters = {};

            //Parse the every term
            for (var i = 1; i < arrSearchTerms.length; i++) {
                var component = arrSearchTerms[i];
                if (typeof (component) != "undefined" && component.length != 0 && component.length > 2) {
                    if (component.indexOf("NOT") != -1 || component.indexOf("AND") != -1) {
                        var subComponent = component.substring(4, component.length - 1);
                        var arrayOfTerms = subComponent.split('=');
                        if (arrayOfTerms.length != 0) {
                            var stringOfField = arrayOfTerms[0];
                            var stringOfValue = arrayOfTerms[1];
                            var tempDic = {};
                            tempDic.term = {};
                            tempDic.term[stringOfField] = stringOfValue;
                            if (component.indexOf("NOT") != -1)
                                data.parameter.query.filtered.filter.bool.must_not.push(tempDic);
                            else
                                data.parameter.query.filtered.filter.bool.must.push(tempDic);
                        }
                    }
                    else if (component.indexOf("|table") != -1)//For Table Chart Type = 1
                    {
                        data.name = "table";
                        //Get the Column list which to be displayed
                        var subComponent = component.substring(7, component.length - 1);
                        //parse the columns and make them aggregation
                        var columns = subComponent.split(',');
                        chartParameters.tableColumns = columns;
                    }
                    else if (component.indexOf("|pie") != -1)//For Pie Chart Type = 2
                    {
                        data.name = "pie";
                        var subComponent = component.substring(5, component.length - 1);
                        data.parameter.aggs = { "0": { "terms": { "field": subComponent } } };
                    }
                    else {
                        var arrayOfTerms = component.split('=');
                        if (arrayOfTerms.length != 0) {
                            var stringOfField = arrayOfTerms[0];
                            var stringOfValue = arrayOfTerms[1];
                            var tempDic = {};
                            tempDic.term = {};
                            tempDic.term[stringOfField] = stringOfValue;
                            data.parameter.query.filtered.filter.bool.should.push(tempDic);
                        }
                    }
                }
                else {
                    console.log("Please check your Search query");
                }
            }
        }
        else {
            console.log("SourceType is missing");
        }
        console.log("The Resultant Parameter :\n" + data.parameter.query);
        return data;
    }

}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
lookupController.$inject = ['$scope', '$ngViewBuilder'];