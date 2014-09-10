
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

                //To Do: params
                var options = {
                    actionmeta: action,
                    el: elementName,
                    eventType: $event.type,
                    action: (action.url || ("/api" + scope.$schema.$metainfo.view + "/" + actionName)),
                    type: action.type,
                    data: action.requestPath ? scope.model[action.requestPath] : scope.model,
                    onComplete: action.onComplete || function (data, ops, hasError) {
                        scope.doParseResponse(data, ops, hasError);
                    }
                };

                var req = action.onBefore ? action.onBefore(options) : scope.doPrepareRequest(options);
                if (req === false)
                    return;

                scope.$doAction(options);
            });
        }
    }

    /************************************************************ Handle REST actions ****************************************************************/
    $scope.$interceptRequest = function (options) {

        if (!options.headers) {
            options.headers = { 'Authorization': 'cd913947-477d-4a4f-bd17-fd5f062dbc24' };
        }
        return options.data;
    }

    $scope.$doAction = function (options) {
        $scope.$doHttpAction(options);
    }

    $scope.$doHttpAction = function (options) {

        options.data = $scope.$interceptRequest(options);

        if (options.type === 'get') {
            $http({
                url: options.action,
                method: (options.type || "GET"),
                params: options.params ? options.params : {},
                headers: options.headers
            })
            .success(function (data) { $scope.$interceptResponse(data, options, false); })
            .error(function (data) { $scope.$interceptResponse(data, options, true); });
        }
        else {
            $http.post(options.action,
                        options.data,
                        {
                            params: options.params ? options.params : {},
                            headers: options.headers
                        })
                .success(function (data) { $scope.$interceptResponse(data, options, false); })
                .error(function (data) { $scope.$interceptResponse(data, options, true); });
        }
    }

    $scope.$interceptResponse = function (data, options, hasError) {
        data = [{ "VesselCode": "KRSE", "VesselName": "KARA SEA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2014-03-25T22:27:11", "Id": 100861, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "BASE", "VesselName": "BARENTS SEA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2014-05-19T19:09:04", "Id": 101601, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "ASBT", "VesselName": "ASIAN BEAUTY", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-07-09T21:35:07", "ModifiedBy": 100142, "ModifiedDate": "2013-07-09T21:35:07", "Id": 101751, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WCFU", "VesselName": "WUGANG CAIFU", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100181, "ModifiedDate": "2013-07-31T05:07:06", "Id": 101892, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "LWSH", "VesselName": "LAIWU STEEL HARMONIOUS", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-08-01T22:40:12", "ModifiedBy": 100181, "ModifiedDate": "2013-08-01T22:40:12", "Id": 101902, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "OSCR", "VesselName": "OSAKA CAR", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-08-11T20:31:50", "ModifiedBy": 100142, "ModifiedDate": "2013-08-11T20:31:50", "Id": 101971, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "NOBL", "VesselName": "NORASIA BELLATRIX", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2013-08-19T00:00:43", "Id": 102021, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WORT", "VesselName": "WUGANG ORIENT", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-08-19T05:32:48", "ModifiedBy": 100181, "ModifiedDate": "2013-08-19T05:32:48", "Id": 102061, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "HNST", "VesselName": "HANDAN STEEL", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-08-22T22:15:46", "ModifiedBy": 100142, "ModifiedDate": "2013-08-22T22:15:46", "Id": 102111, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "HYNW", "VesselName": "HYUNDAI NEW YORK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-08-27T03:41:10", "ModifiedBy": 100142, "ModifiedDate": "2013-08-27T03:41:10", "Id": 102151, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "MAEU", "VesselName": "MAERSK EUBANK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-03T23:04:12", "ModifiedBy": 100142, "ModifiedDate": "2013-09-03T23:04:12", "Id": 102191, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CASK", "VesselName": "CAPE STORK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-16T22:25:38", "ModifiedBy": 100142, "ModifiedDate": "2013-09-16T22:25:38", "Id": 102331, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CHAW", "VesselName": "CAPE HAWK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-17T00:56:57", "ModifiedBy": 100142, "ModifiedDate": "2013-09-17T00:56:57", "Id": 102341, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "KEPA", "VesselName": "KENTON PARK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-22T23:10:02", "ModifiedBy": 100142, "ModifiedDate": "2013-09-22T23:10:02", "Id": 102411, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "BGAT", "VesselName": "BRIDGEGATE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-23T23:45:08", "ModifiedBy": 100142, "ModifiedDate": "2013-09-23T23:45:08", "Id": 102441, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "HEYT", "VesselName": "HEYTHROP", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2013-10-09T01:42:48", "Id": 102541, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CANT", "VesselName": "CAP ARNAUTI", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-11-20T21:41:50", "ModifiedBy": 100142, "ModifiedDate": "2013-11-20T21:41:50", "Id": 102781, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WEGA", "VesselName": "WEST GATE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-12-01T22:57:36", "ModifiedBy": 100181, "ModifiedDate": "2013-12-01T22:57:36", "Id": 102821, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "SGGT", "VesselName": "SHAGANG GIANT", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-12-19T00:32:13", "ModifiedBy": 100181, "ModifiedDate": "2013-12-19T00:32:13", "Id": 102931, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CAEL", "VesselName": "CAPE EAGLE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2014-01-02T00:03:16", "ModifiedBy": 100181, "ModifiedDate": "2014-01-02T00:03:16", "Id": 103001, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WASI", "VesselName": "WUGANG ASIA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-01-27T20:36:35", "ModifiedBy": 100142, "ModifiedDate": "2014-01-27T20:36:35", "Id": 103121, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "GFIR", "VesselName": "GUOFENG FIRST", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-01-31T23:38:15", "ModifiedBy": 100142, "ModifiedDate": "2014-01-31T23:38:15", "Id": 103141, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CPER", "VesselName": "CAPE PEREGRINE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-02-05T02:49:05", "ModifiedBy": 100142, "ModifiedDate": "2014-02-05T02:49:05", "Id": 103151, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CELD", "VesselName": "CMA CGM ENFIELD", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-02-13T21:32:42", "ModifiedBy": 100142, "ModifiedDate": "2014-02-13T21:32:42", "Id": 103211, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "GRAY", "VesselName": "GREEN RAY ", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-04-09T22:53:41", "ModifiedBy": 100142, "ModifiedDate": "2014-04-09T22:53:41", "Id": 103461, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "NWAY", "VesselName": "NOBLEWAY", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-04-28T23:37:01", "ModifiedBy": 100142, "ModifiedDate": "2014-04-28T23:37:01", "Id": 103531, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "ASEA", "VesselName": "ANDAMAN SEA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-05-14T19:26:51", "ModifiedBy": 100142, "ModifiedDate": "2014-05-14T19:26:51", "Id": 103581, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "MBEL", "VesselName": "MSC BELLATRIX", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-04T20:16:13", "ModifiedBy": 100142, "ModifiedDate": "2014-06-04T20:16:13", "Id": 103751, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "THUG", "VesselName": "THURINGIA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-18T18:52:09", "ModifiedBy": 100142, "ModifiedDate": "2014-06-18T18:52:09", "Id": 103791, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "PUSA", "VesselName": "PUSAN", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-18T23:35:10", "ModifiedBy": 100142, "ModifiedDate": "2014-06-18T23:35:10", "Id": 103801, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "OTOW", "VesselName": "OSAKA TOWER", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-26T19:18:25", "ModifiedBy": 100142, "ModifiedDate": "2014-06-26T19:18:25", "Id": 103881, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "RUND", "VesselName": "RUTLAND", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-27T16:58:49", "ModifiedBy": 100142, "ModifiedDate": "2014-06-27T16:58:49", "Id": 103891, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "NIGF", "VesselName": "NILEDUTCH GIRAFFE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-07-01T23:32:36", "ModifiedBy": 100142, "ModifiedDate": "2014-07-01T23:32:36", "Id": 103922, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "SFAI", "VesselName": "SHANGANG FAITH", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2014-07-10T19:15:33", "Id": 103971, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "INFR", "VesselName": "INDIAN FRIENDSHIP", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-07-15T20:12:08", "ModifiedBy": 100142, "ModifiedDate": "2014-07-15T20:12:08", "Id": 104001, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "DVGT", "VesselName": "DEVONGATE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-09-01T21:29:23", "ModifiedBy": 100142, "ModifiedDate": "2014-09-01T21:29:23", "Id": 104261, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }];
        if (options.el) {
            scope = angular.element('#' + options.el).scope();
            if (data && options.actionmeta.responsePath)
                scope.model[options.actionmeta.responsePath] = data;
        }

        if (options['onComplete'])
            options['onComplete'](data, options, hasError);
    }
    /**
    * Destroy scope and leaky objects
    */
    $scope.$on('$destroy', function () {
        console.log('Destroy - ' + $scope.$id);
    });
}]);