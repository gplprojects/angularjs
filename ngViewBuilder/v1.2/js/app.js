/**
 * Define your appname and will be used as you app.
 * Note: Any changes you do here will have impact on your app, so please do change in ng-app attribute to make your app run soomthly.
 */
window.appName = "angBuilder";

/**
 * Setting up angular application and list of dependency modules 
 * @ui.router - Angular state provider
 * @ngViewBuilder - Generate dynamic html view from JSON and TPL
 * @ngGrid - Data grid
 * @angles - Angular directive for Chart.js
 * @leaflet-directive - Angular directive for leaflet
 * @ui.bootstrap - Angular ported bootstrap 
 */
window[appName] = angular.module(appName, ['ui.router', 'ngViewBuilder', 'ngGrid', 'angles', 'leaflet-directive', 'ui.bootstrap']);

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
        console.log("Total time taken to render view '" + (scope.$schema.$metainfo.view) + "' is '" + (end.getTime() - start.getTime()) +" ms'");
    }
    
    /************************************************************ Handle REST actions ****************************************************************/
    $scope.interceptRequest = function (restAction, actionType, data, successCallback, errorCallback) {
        return data;
    }

    $scope.doHttpAction = function (restAction, actionType, data, successCallback, errorCallback) {

        $scope.interceptRequest(restAction, actionType, data);

        if (actionType === 'get') {
            $http({
                url: 'app/' + restAction,
                method: (actionType || "GET")
            })
            .success(function (data) { interceptResponse(data, successCallback); })
            .error(function (data) { interceptResponse(data, errorCallback); });
        }
        else {
            $http.post('app/' + restAction, data)
                .success(interceptResponse)
                .error(interceptResponse);
        }
    }

    $scope.interceptResponse = function (data, callback) {
        callback(data);
    }
    /**
    * Destroy scope and leaky objects
    */
    $scope.$on('$destroy', function () {
        console.log('Destroy - ' + $scope.$id);
    });
}]);