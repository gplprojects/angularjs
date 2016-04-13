function lookupController($scope) {
    
    $scope.model = { userQueryText: 'aaa' };

    $scope.doPrepareRequest = function (ops) {
        return;
    }


    $scope.doParseResponse = function (data, ops, hasError) {
        console.log(ops.action);
    }


    $scope.Test = function ($event) {

        var action = null;

        if ($scope.model.userQueryText.length != 0) {
            if ($event.keyCode == 61) {
                //To get all SourceTypes
                action = {
                    name: 'sourcetypes',
                    type: 'post',
                    url: 'http://127.0.0.1:9200/_all/_search?pretty=1',
                    data: { "_source": false, "size": 0, "query": { "query_string": { "query": "SourceType:*" } }, "aggs": { "aggForSourceType": { "terms": { "field": "SourceType", "size": 0 } } } }
                }
                //getSearchData(1, "post", 'http://127.0.0.1:9200/_all/_search?pretty=1', { "_source": false, "size": 0, "query": { "query_string": { "query": "SourceType:*" } }, "aggs": { "aggForSourceType": { "terms": { "field": "SourceType", "size": 0 } } } });
            }
            else if ($event.keyCode == 32) {
                //To Get Properties of an Index "logstash-2014.12.23"
                action = {
                    name: 'properties',
                    type: 'get',
                    url: 'http://127.0.0.1:9200/logstash-2014.12.23/_mapping?pretty=1',
                }
                //getSearchData(2, "get", 'http://127.0.0.1:9200/logstash-2014.12.23/_mapping?pretty=1');
            }
            else if ($event.keyCode == 13) {
                $scope.showSuggestion = false;
                var temparr = $scope.model.userQueryText.split(' ');
                temparr = temparr[0].split('=');
                var parameter = { "_source": true, "size": 1, "query": { "query_string": { "query": "SourceType:" + temparr[1] } }, "aggs": { "0": { "terms": { "field": "message.raw", "size": 20 } } } };

                action = {
                    name: 'lookup',
                    type: 'post',
                    url: 'http://127.0.0.1:9200/_all/_search?pretty=1',
                    data: { "_source": true, "size": 1, "query": { "query_string": { "query": "SourceType:" + temparr[1] } }, "aggs": { "0": { "terms": { "field": "message.raw", "size": 20 } } } }
                }
                //getSearchData(3, "post", 'http://127.0.0.1:9200/_all/_search?pretty=1', parameter);
            }

            if (action) {
                $scope.$prepareAndExecute($scope, $event, null, action, action.name);
            }
        }
    }

    $scope.selectValue = function (index) {
        var suggestedText = $scope.arrayOfSuggestions[index];
        $scope.model.userQueryText += $scope.arrayOfSuggestions[index];
        $scope.showSuggestion = false;
    };


    /******************************** To Do - Cleanup Latter *********************************************/
    $scope.lookUp = function ($event) {
        
        $scope.parseAll();
        return;

        var action = null;

        if (!$scope.model.userQueryText || $scope.model.userQueryText == "" || $scope.model.userQueryText == 'index' || $scope.model.userQueryText == 'index=') {
            action = {
                        type: 'get',
                        url: 'http://127.0.0.1:9200/_cat/indices?v'
                    }
        } else if($event.keyCode == 32 || $event.keyCode == 186 || $event.keyCode == 187) { //SPACE || ; || =
            //To Do: Build request (i.e., prepare Elasticsearc query from user text)
        }

        if (action){
            $scope.$prepareAndExecute($scope, $event, null, action, 'lookup');
        }
    }


    $scope.parseAll = function () {

        var parsedQuery = { "facets": { "0": { "query": { "filtered": { "query": { "query_string": { "query": "" } }, "filter": { "bool": { "must": [{ "match_all": {} }] } } } } } }, "size": 0 };
        var queries = $scope.model.userQueryText.split('|');

        for (var index in queries) {

            $scope.parseSingle(queries[index], parsedQuery.facets['0']);
        }
    }

    $scope.parseSingle = function (query, facet) {

        // SourceType=Test (id=10 AND name=a) (time<now)
        // SourceType=Test (id=10 AND name=a) (time<now)
        var tokens = [], terms = [], must = [], should = [];

        if (/index(?==)/.test(query)) {
            
            facet.query.filtered.query.query_string.query = "index=" + $scope.getValueByTerm('index', query);

        } else if (/type(?==)/.test(query)) {
            facet.query.filtered.query.query_string.query = "type=" + $scope.getValueByTerm('type', query);
        }
        else if (/SourceType(?==)/.test(query)) {
            facet.query.filtered.query.query_string.query = "SourceType=" + $scope.getValueByTerm('SourceType', query);
        }
            
        console.log(facet.query.filtered.query.query_string.query);

        //Delete term + value from query
        //To Do: Skip reserved terms insted delete
        query.replace(facet.query.filtered.query.query_string.query)

        for (var i = 0; i < query.length; i++) {
            
            if (query[i] == "=")
                tokens.push({ key: query.substring(0, i), value: "" });
        }

        console.log(tokens);
    }

    $scope.getSubQuery = function () {

    }

    $scope.getOperators = function () {

    }

    $scope.getValueByTerm = function (term, query) {

        var querySplit = query.split(term + '=');
        switch (querySplit[1][0])
        {
            case '"':
                for (var chr = 1; chr < querySplit[1].length; chr++)
                    if (querySplit[1][chr] = '"')

                        return (querySplit[1].indexOf(' ') ? querySplit[1].substring(0, chr) : querySplit[1].substring(0, querySplit[1].indexOf(' '))) || "";
                    
            default:
                return (querySplit[1].indexOf(' ') ? querySplit[1].substring(0) : querySplit[1].substring(0, querySplit[1].indexOf(' '))) || "";
        }
        
    }

    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
lookupController.$inject = ['$scope'];
