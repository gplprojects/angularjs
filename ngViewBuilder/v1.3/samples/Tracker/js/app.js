
/**
 * Setting up angular application and list of dependency modules 
 * @ui.router - Angular state provider
 * @ngViewBuilder - Generate dynamic html view from JSON and TPL
 * @ngGrid - Data grid
 * @angles - Angular directive for Chart.js
 * @leaflet-directive - Angular directive for leaflet
 * @ui.bootstrap - Angular ported bootstrap 
 */
window[appName] = angular.module(appName, ['ui.router',
                                           'ngViewBuilder',
                                           'ngGrid',
                                           'angles',
                                           'leaflet-directive',
                                           'ui.bootstrap',
                                           'highcharts-ng'
]);

/**
 * Define some of usefull provider to work with lazy loading
 */
window[appName].config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
    window[appName].register =
        {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };
}]);

/**
 * Define parent controller
**/
window[appName].controller('applicationController', ['$rootScope', '$scope', '$http', '$ngViewBuilder', '$ngViewLoader', function ($rootScope, $scope, $http, $ngViewBuilder, $ngViewLoader) {

    //Keep something in global (i.e.,not in $rootScope)
    $scope.meta = {
        name: "Demo Application",
        version: '0.1',
        author: 'Murugesan G',
        date: 'Jul 2014',
        view: 'Root'
    };

    /*************************************************** Handle screen initialization and build view *************************************************/
    /**
    * Base API which will gets view meta info. from backend
    * @viewName (String) - View Name
    * @callback (function) - Callback function to process meta data
    */
    $scope.getScreenMeta = function (viewName, callback) {
        $ngViewLoader.loadMeta(viewName, callback, "js/meta");
    }

    /**
    * Base API which will takes view meta as input and sends it to formbuilder to generate view
    * @scope (Object) - View scope
    */
    $scope.InitializeScreen = function (scope) {
        var start = new Date();

        $ngViewBuilder.build(scope);

        var end = new Date();
        console.log("Total time taken to render view '" + (scope.$schema.$metainfo.view) + "' is '" + (end.getTime() - start.getTime()) + " ms'");

        if (scope.initModule) scope.initModule();
    }

    /************************************************************ Handle DOM actions ****************************************************************/
    $scope.$doPefromAction = function ($event, elementName, scope) {

        if (!scope && !$event)
            return;

        if (!scope && $event) {
            scope = angular.element($event.target).scope()
        }

        if (!scope)
            scope = $scope;

        if (scope.$schema.config[elementName]) {

            angular.forEach(scope.$schema.config[elementName].actions, function (action, actionName) {

                console.log("Performing action - " + actionName);

                var options = {
                    el: elementName,
                    eventType: $event.type,
                    action: scope.$schema.$metainfo.view + "/" + actionName,
                    type: action.type,
                    data: req,
                    onComplete: function (data, ops, hasError) {
                        scope.doParseResponse(data, ops, hasError);
                    }
                };

                var req = scope.doPrepareRequest(options);
                if (req === false)
                    return;

                scope.$doAction(options);
            });
        }
    }

    /************************************************************ Handle REST actions ****************************************************************/
    $scope.$interceptRequest = function (options) {
        return options.data;
    }

    $scope.$doAction = function (options) {
        $scope.$doHttpAction(options);
    }

    $scope.$doHttpAction = function (options) {

        options.data = $scope.$interceptRequest(options);

        if (options.type === 'get') {
            $http({
                url: 'app/' + options.action,
                method: (options.type || "GET")
            })
            .success(function (data) { $scope.$interceptResponse(data, options, false); })
            .error(function (data) { $scope.$interceptResponse(data, options, true); });
        }
        else {
            $http.post('app/' + options.action, options.data)
                .success(function (data) { $scope.$interceptResponse(data, options, false); })
                .error(function (data) { $scope.$interceptResponse(data, options, true); });
        }
    }

    $scope.$interceptResponse = function (data, options, hasError) {
        if (options[hasError ? 'onSuccess' : 'onError'])
            options[hasError ? 'onSuccess' : 'onError'](data, options, hasError);
    }
    /**
    * Destroy scope and leaky objects
    */
    $scope.$on('$destroy', function () {
        console.log('Destroy - ' + $scope.$id);
    });
}]);