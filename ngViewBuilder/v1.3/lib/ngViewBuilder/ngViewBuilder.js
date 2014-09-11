/**
 * A Template based Angular view builder module
 */
angular.module('ngViewBuilder', [])

/**
 * Preload required templates 
 */
.run(['$q', '$ngViewUtility', function ($q, $ngViewUtility) {
    
}])

/**
* Utility Service
*/
.service('$ngViewUtility', ['$rootScope', '$templateCache', '$http', '$q', '$log', function ($rootScope, $templateCache, $http, $q, $log) {
    this.getTemplate = function (template) {

        if (/<.+>/.test(template))
            $templateCache.put(template, template);
        else {
            $.ajax({
                type: "GET",
                url: (template.indexOf("/") != -1 ? '' : (window.appPath.tpl || (window.appPath.lib + 'ngViewBuilder/tpl/'))) + template + '.html',
                async: false
            }).success(function (content) {
                $templateCache.put(template, content)
            });
        }
        return $templateCache.get(template) || "<div> Template content not found </div>";
    };

    this.getTemplateFromCache = function (templateKey) {
        return $templateCache.get(templateKey) || this.getTemplate(templateKey);
    };

    this.getDefaultConfig = function(controlType) {

        switch(controlType){
            case "ng-gid":
                break;
            case "chartjs":
                return {
                    // Boolean - Whether to animate the chart
                    animation: true,
                    // Number - Number of animation steps
                    animationSteps: 60,
                    // String - Animation easing effect
                    animationEasing: "easeOutQuart",
                    // Boolean - If we should show the scale at all
                    showScale: true,
                    // Boolean - If we want to override with a hard coded scale
                    scaleOverride: false,
                    // ** Required if scaleOverride is true **
                    // Number - The number of steps in a hard coded scale
                    scaleSteps: null,
                    // Number - The value jump in the hard coded scale
                    scaleStepWidth: null,
                    // Number - The scale starting value
                    scaleStartValue: null,
                    // String - Colour of the scale line
                    scaleLineColor: "rgba(0,0,0,.1)",
                    // Number - Pixel width of the scale line
                    scaleLineWidth: 1,
                    // Boolean - Whether to show labels on the scale
                    scaleShowLabels: true,
                    // Interpolated JS string - can access value
                    scaleLabel: "<%=value%>",
                    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
                    scaleIntegersOnly: true,
                    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                    scaleBeginAtZero: false,
                    // String - Scale label font declaration for the scale label
                    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    // Number - Scale label font size in pixels
                    scaleFontSize: 12,
                    // String - Scale label font weight style
                    scaleFontStyle: "normal",
                    // String - Scale label font colour
                    scaleFontColor: "#666",
                    // Boolean - whether or not the chart should be responsive and resize when the browser does.
                    responsive: false,
                    // Boolean - Determines whether to draw tooltips on the canvas or not
                    showTooltips: true,
                    // Array - Array of string names to attach tooltip events
                    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
                    // String - Tooltip background colour
                    tooltipFillColor: "rgba(0,0,0,0.8)",
                    // String - Tooltip label font declaration for the scale label
                    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    // Number - Tooltip label font size in pixels
                    tooltipFontSize: 14,
                    // String - Tooltip font weight style
                    tooltipFontStyle: "normal",
                    // String - Tooltip label font colour
                    tooltipFontColor: "#fff",
                    // String - Tooltip title font declaration for the scale label
                    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    // Number - Tooltip title font size in pixels
                    tooltipTitleFontSize: 14,
                    // String - Tooltip title font weight style
                    tooltipTitleFontStyle: "bold",
                    // String - Tooltip title font colour
                    tooltipTitleFontColor: "#fff",
                    // Number - pixel width of padding around tooltip text
                    tooltipYPadding: 6,
                    // Number - pixel width of padding around tooltip text
                    tooltipXPadding: 6,
                    // Number - Size of the caret on the tooltip
                    tooltipCaretSize: 8,
                    // Number - Pixel radius of the tooltip border
                    tooltipCornerRadius: 6,
                    // Number - Pixel offset from point x to tooltip edge
                    tooltipXOffset: 10,
                    // String - Template string for single tooltips
                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
                    // String - Template string for single tooltips
                    multiTooltipTemplate: "<%= value %>",
                    // Function - Will fire on animation progression.
                    onAnimationProgress: function(){},
                    // Function - Will fire on animation completion.
                    onAnimationComplete: function(){}
                };
                break;

            default:
                break;
        }

        return false;
    }
}])

/**
 * Angular view loader
 */
.service('$ngViewLoader', ['$rootScope', '$q', '$http', '$log', function ($rootScope, $q, $http, $log) {

    /**
     * Load module controller and initialize meta data
     */
    this.load = function (viewName, uri, controllerName, skipRendering) {
        if (!uri) {
            $log.warn("ngViewLoader - loadController: URI is not defined controller '" + controllerName + "' and view name '" + viewName + "'");
            return;
        }

        var defer = $q.defer();
        require(angular.isArray(uri) ? uri : [uri], function () {
            if (!controllerName)
                controllerName = viewName + 'Controller';

            //Get controller prototype
            var controller = (window[controllerName]);
            if (typeof controller == 'function') {
                //Meta info
                controller.prototype.$metaInfo = { view: viewName, controller: controllerName, controllerSrc: uri, loadedBy: 'loader' };
                //Init
                controller.prototype.$init = function (scope) {
                    if (skipRendering === true) {
                        $log.info("ngViewBuilder - $init: User has set true to skip view building '" + controllerName + "' and view name '" + viewName + "'");
                        return;
                    }
                    scope.getScreenMeta(this.$metaInfo.view, function (metaData) {
                        if (!metaData)
                            return;
                        scope.schema = eval(metaData);
                        scope.schema.$metainfo = controller.prototype.$metaInfo;
                        scope.InitializeScreen(scope);
                    });
                }
            }

            defer.resolve();
            $rootScope.$apply()
        });
        return defer.promise;
    };

    /**
     * Load view meta data and used for rendering dynamic view
     */
    this.loadMeta = function (viewName, callback, metaPath) {
        $http({
            url: (metaPath ? metaPath: 'js/meta') + '/' + viewName + '.js',
            method: "GET",
            contentType: 'application/json'
        })
       .success(callback)
       .error(function () {
           $log.warn("ngViewLoader - loadMeta: Failed load metadata for the view '" + viewName + "'");
           callback();
       });
    }
}])

/**
 * Angular view builder
 * To Do(s)
 * 1. Default options/config for ng-grid, chartjs, tabpanel
 * 2. Support to inbuilt validations and rules
 * 3. More templates and composite elements
 * 4. Optional Support - SmartTable, jqPlot, HighCharts, Google Maps
 * 5. Mock REST responder and request handler - Will be used for dev and not for productions
 * 6. Feasibility of setingup UTC in anyone of FW Karma, Grunt, Mocha...
 */
.service('$ngViewBuilder', ['$rootScope', '$templateCache', '$compile', '$interpolate', '$http', '$q', '$timeout', '$log', '$ngViewLoader', '$ngViewUtility', function ($rootScope, $templateCache, $compile, $interpolate, $http, $q, $timeout, $log, $ngViewLoader, $ngViewUtility) {

    /**
     * API exposed to module controller to build view
     * scope (angular scope) - Should be actual scope of controller
     */
    this.build = function (scope) {
        if (!scope.schema)
            return;

        if (!scope.model)
            scope.model = {};

        if (!scope.$schema)
            scope.$schema = { options: {}, config: {} };
        else {
            if (!scope.$schema.options)
                scope.$schema.options = {};
            if (!scope.$schema.config)
                scope.$schema.config = {};
        }

        if (!scope.$temp)
            scope.$temp = {};

        scope.$schema.$metainfo = scope.schema.metainfo || { view: scope.schema.view};

        var rootElName = scope.$schema.elName || (scope.$schema.$metainfo.view ? 'screen-' + scope.$schema.$metainfo.view : false);
        var rootEl = angular.element(rootElName ? '#' + rootElName : document.body);
        
        try {
            buildInternal(scope, scope.schema, scope.schema, rootEl, scope.model);
            angular.element(".progress").css('display', 'none');
        }
        catch (e) {
            angular.element(".progress").html('<p class="text-center progress"><span class="label label-danger">' + (e.message || "Done with error! Failed to build view " + scope.$schema.$metainfo.view) + '</span></p>');
            $log.error(e);
        }
        
        //finally compile 
        $compile(rootEl.contents())(scope);

        delete scope.schema;
    };

    /////////////////////////////// Internal / Private methods ////////////////////////////
    /**
     * Init or return defined model
     */
    function getModel(control, model, isFormElement, defaultValue) {
        var modelPath = control.model || (isFormElement === true ? (control.model || control.name) : control.model)

        if (control.type != 'button' && control.noBind !== true && modelPath && modelPath.indexOf(".") == -1) {
            if (model && !model[modelPath])
                model[modelPath] = defaultValue;

            return modelPath;
        }
        return false;
    }
    
    /**
     * Set dom attributes from meta
     */
    function addAttributes(meta, htmlEl) {
        angular.forEach(meta.attr, function (attributeValue, attributeKey) {
            if (attributeKey == 'class' || attributeKey == 'cls')
                htmlEl.addClass(attributeValue);
            else
                htmlEl.attr(attributeKey, attributeValue);
        });
    }

    function buildInternal(scope, meta, key, parentEl, model) {

        angular.forEach(meta.panels, function (panel, key) {
            buildControlByType(scope, panel, key, parentEl, null, model);
        });
    }

    /**
     * Generic method - will redirects based on type
     */
    function buildControlByType(scope, control, key, parentEl, dataPath, model) {

        control.interpolateStartSymbol = "{{";
        control.interpolateEndSymbol = "}}";

        control.id = (control.id || control.name || key);
        if (!control.name)
            control.name = control.id;

        if (control.config)
            scope.$schema.config[control.name] = control.config;

        switch (control.type) {
            case "form":
                var modelPath = getModel(control, model, true, {});
                buildFormPanel(scope,
                               control,
                               key,
                               parentEl,
                               (dataPath ? dataPath + "." + modelPath : modelPath),
                               false,
                               model ? model[modelPath] : undefined);
                break;

            case "text":
            case "number":
            case "email":
            case "password":
            case "date":
            case "datepicker":
            case "time":
            case "select":
            case "multiselect":
            case "checkbox":
            case "radio":
            case "button":
            case "textarea":
                buildFormElement(scope, control, key, parentEl, dataPath, false, model);
                break;

            case "custom":
                var modelPath = getModel(control, model, false, {});
                if (typeof scope.buildFormElement != 'undefined')
                    scope.buildFormElement(scope,
                                           control,
                                           key,
                                           parentEl,
                                           modelPath ? (dataPath ? (dataPath + "." + modelPath) : modelPath) : (dataPath || modelPath),
                                           false,
                                           (modelPath && model) ? model[modelPath] : model);
                break;
          
            default:
                var modelPath = getModel(control, model, false, {});
                buildPanel(scope,
                            control,
                            key,
                            parentEl,
                            //modelPath ? (dataPath ? (dataPath + "." + modelPath) : modelPath) : modelPath,
                            modelPath ? (dataPath ? (dataPath + "." + modelPath) : modelPath) : (dataPath || modelPath),
                            false,
                            (modelPath && model) ? model[modelPath] : model);
                break;
        }
    }

    /**
     * Build panel / field of type unknown
     */
    function buildPanel(scope, control, key, parentEl, dataPath, isCallback, model) {

        var template = control.content || '<div id="{{id}}" name="{{name}}"></div>';

        if (!control.content && (control.template || control.type)) {
            template = $ngViewUtility.getTemplateFromCache(control.template || control.type);
            if (!template)
                template = '<div id="{{id}}" name="{{name}}"></div>';
        }

        control.dataPath = dataPath || control.name;
        control.showTitle = (control.showTitle || control.title || control.label) ? true : false;
        if (!scope.$temp[control.name])
            scope.$temp[control.name] = {};

        var defaultConfig = $ngViewUtility.getDefaultConfig(control.controltype);
        switch(control.type) {
            case "gridpanel":
                    
                    if (!scope.$schema.config[control.name].data)
                        scope.$schema.config[control.name].data = ("model." + (dataPath ? dataPath : (control.model || control.name)))

                    if (!scope.$schema.config[control.name].selectedItems) {
                        scope.$temp[control.name].selectedItesm = [];
                        scope.$schema.config[control.name].selectedItems = scope.$temp[control.name].selectedItesm;
                    }
                    break

            case "chartpanel":

                if (defaultConfig)
                    scope.$schema.config[control.name] = angular.extend(defaultConfig, scope.$schema.config[control.name]);
                
                control.config.height = control.config.height || '98%';
                control.config.width = control.config.width || '98%';
                break;

            case "mappanel":
                break;

            case "tabpanel":
                control.handle = control.handle || "handleViewEvents";
                
                if (scope.$schema.config[control.name].tabs && scope.$schema.config[control.name].tabs.length) {
                    
                    angular.forEach(scope.$schema.config[control.name].tabs, function (tab) {
                        if (tab.children && !tab.content && !tab.contentURL) {
                            if (!$templateCache.get(tab.id + ".html")) {
                                var tabContentPanel = angular.element("<div></div>");
                                angular.forEach(tab.children, function (tabChild, tabChildName) {
                                    buildControlByType(scope, tabChild, tabChildName, tabContentPanel, dataPath, model);
                                });
                                $templateCache.put(tab.id + ".html", tabContentPanel.html());
                                delete tabContentPanel;
                            }
                        }
                    });
                }
                break;
        }

        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var panelEl = angular.element($interpolate(template)(control));

        addAttributes(control, (panelEl.attr('id') !== control.id ? angular.element('#' + control.id, panelEl) : panelEl));
        
        if (!control.content && control.children) {
            angular.forEach(control.children, function (childObject, childName) {
                buildControlByType(scope, childObject, childName, (panelEl.attr('id') !== control.id ? angular.element('#' + control.id, panelEl) : panelEl), dataPath, model);
            });
        }

        if (control.compile)
            $compile(panelEl.contents())(scope);

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, panelEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        parentEl.append(panelEl);
    }

    /**
     * Build form panel
     */
    function buildFormPanel(scope, control, key, parentEl, dataPath, isCallback, model) {

        var template = $ngViewUtility.getTemplateFromCache(control.template || control.type);
        if (!template)
            template = '<form id="{{id}}" name="{{name}}"></form>';
            
        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var formEl = angular.element($interpolate(template)(control));

        addAttributes(control, formEl);

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, formEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        if (control.children) {
            angular.forEach(control.children, function (childObject, childName) {
                buildControlByType(scope, childObject, childName, formEl, dataPath, model);
            });
        }

        if (control.compile)
            $compile(formEl.contents())(scope);

        parentEl.append(formEl);
    }

    /**
     * Build leaf element (i.e., fields like text, select, checkbox...)
     */
    function buildFormElement(scope, control, key, parentEl, dataPath, isCallback, model) {

        control.dataPath = dataPath ? dataPath : '';

        var templateType = control.template || control.type;

        control.handle = control.handle || 'handleViewEvents';

        if (scope.schema.options && scope.schema.options[control.name])
            scope.$schema.options[control.name] = scope.schema.options[control.name];

        var modelPath = getModel(control, model, (control.type != 'button' && control.noBind !== true), null);
        if (model && modelPath) {
            model[modelPath] = model[modelPath] || null;
            control.dataPath += (control.dataPath ? "." : "") + modelPath;
        }

        if (control.actions) {
            if(!scope.$schema.config[control.name])
                scope.$schema.config[control.name] = {};

            scope.$schema.config[control.name].actions = control.actions;
        }
        
        switch (control.type) {
            case 'text':
            case 'password':
            case 'number':
                templateType = 'text';
                break

            case "date":
                scope.$schema.config[control.name].format = scope.$schema.config[control.name].format || 'dd/MM/yyyy';
                scope.$schema.config[control.name].closeText = scope.$schema.config[control.name].closeText || 'Close';
                break;

            case "datepicker":
                if (!control.config)
                    control.config = {};
                control.config.showWeeks = control.config.showWeeks || false;
                control.config.height = control.config.height || 250;
                break;

            case "select":
            case "multiselect":
                control.optionsKey = control.optionsKey || "$schema.options." + control.name;
                control.optionKey = control.optionKey || 'key';
                control.optionValue = control.optionValue || 'value';
                break;

            case "checkbox":
            case "radio":
                
                control.hasOptions = control.hasOptions || scope.$schema.options[control.name] ? true : false;
                if (control.hasOptions) {
                    control.optionsKey = control.optionsKey || "$schema.options." + control.name;
                    control.optionKey = control.optionKey || 'key';
                    control.optionValue = control.optionValue || 'value';
                }

                if (model) {
                    if (control.type === 'checkbox') {

                        model[modelPath] = [];
                        angular.forEach(scope.$schema.options[control.name], function () {
                            model[modelPath].push(false);
                        });
                    }
                }
                break;

            default:
                break;
        }

        var template = $ngViewUtility.getTemplateFromCache(templateType);
        if (!template)
            template = "<p> Template '" + templateType + ".html' not found!<p>"
            
        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var fieldEl = $interpolate(template)(control);
        if (control.compile)
            $compile(fieldEl.contents())(scope);

        parentEl.append(fieldEl);
        addAttributes(control, angular.element('#' + control.id, parentEl));

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, fieldEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);
        return;
    }
}]).controller('$viewBuilderController', ['$rootScope', '$scope', '$http', '$ngViewBuilder', '$ngViewLoader', '$location', function ($rootScope, $scope, $http, $ngViewBuilder, $ngViewLoader, $location) {

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
    /**
     * DOM action handler
     */
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
                var options = angular.copy(action);
                options.el = elementName;
                options.eventType = $event.type;
                options.action = (action.url || ("/api" + scope.$schema.$metainfo.view + "/" + actionName));
                options.data = action.requestPath ? scope.model[action.requestPath] : scope.model
                options.onComplete = action.onComplete || function (data, ops, hasError) {
                    scope.doParseResponse(data, ops, hasError);
                }

                var req = action.onBefore ? action.onBefore(options) : scope.doPrepareRequest(options);
                if (req === false)
                    return;

                scope.$doAction(options);
            });
        }
    }

    /************************************************************ Handle REST actions ****************************************************************/
    /**
     * Intercept all REST request 
     */
    $scope.$interceptRequest = function (options) {

        if (!options.headers) {
            options.headers = { 'Authorization': 'cd913947-477d-4a4f-bd17-fd5f062dbc24' };
        }
        return options.data;
    }

    /**
     * Raw REST action handler - Based on action configuration switches framework
     */
    $scope.$doAction = function (options) {
        options.data = $scope.$interceptRequest(options);

        switch (options.processingType) {
            case "nav":
                $location.path(options.path || options.url);
                break;
            case 'ajax':
                $scope.$doAjaxAction(options);
                break;

            case 'localstore':
                $scope.$doHttpAction(options);
                break;

            case '$http':
            case 'http':
            case 'angular':
            default:
                $scope.$doHttpAction(options);
        }
    }

    /**
     * Use local store for handling application data (Usefull for dev and debug versions)
     */
    $scope.$doLocalStore = function (options) {

        if (options.type === 'set')
            localStorage.setItem(options.action, JSON.stringify(options.data));
        
        return JSON.parse(localStorage.getItem(options.action));
    }

    /**
     * Use JQuery's ajax for executing REST actions
     */
    $scope.$doAjaxAction = function (options) {
        switch (options.type) {
            case "post":
                $.ajax.post(options.action,
                    options.data,
                    {
                        params: options.params ? options.params : {},
                        headers: options.headers
                    })
                    .success(function (data) { $scope.$interceptResponse(data, options, false); })
                    .error(function (data) { $scope.$interceptResponse(data, options, true); });
                break;

            default:
                $.ajax({
                    url: options.action,
                    method: (options.type || "GET"),
                    params: options.params ? options.params : {},
                    headers: options.headers
                })
                .success(function (data) { $scope.$interceptResponse(data, options, false); })
                .error(function (data) { $scope.$interceptResponse(data, options, true); });
                break;
        }
    }

    /**
     * Angular way of executing REST calls
     */
    $scope.$doHttpAction = function (options) {

        switch (options.type) {
            case "post":
                    $http.post(options.action,
                        options.data,
                        {
                            params: options.params ? options.params : {},
                            headers: options.headers
                        })
                        .success(function (data) { $scope.$interceptResponse(data, options, false); })
                        .error(function (data) { $scope.$interceptResponse(data, options, true); });
                break;
            
            default:
                $http({
                    url: options.action,
                    method: (options.type || "GET"),
                    params: options.params ? options.params : {},
                    headers: options.headers
                })
                .success(function (data) { $scope.$interceptResponse(data, options, false); })
                .error(function (data) { $scope.$interceptResponse(data, options, true); });
            break;
        }
    }

    /**
     * Intercept all REST calls response 
     */
    $scope.$interceptResponse = function (data, options, hasError) {
        data = [{ "VesselCode": "KRSE", "VesselName": "KARA SEA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2014-03-25T22:27:11", "Id": 100861, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "BASE", "VesselName": "BARENTS SEA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2014-05-19T19:09:04", "Id": 101601, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "ASBT", "VesselName": "ASIAN BEAUTY", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-07-09T21:35:07", "ModifiedBy": 100142, "ModifiedDate": "2013-07-09T21:35:07", "Id": 101751, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WCFU", "VesselName": "WUGANG CAIFU", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100181, "ModifiedDate": "2013-07-31T05:07:06", "Id": 101892, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "LWSH", "VesselName": "LAIWU STEEL HARMONIOUS", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-08-01T22:40:12", "ModifiedBy": 100181, "ModifiedDate": "2013-08-01T22:40:12", "Id": 101902, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "OSCR", "VesselName": "OSAKA CAR", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-08-11T20:31:50", "ModifiedBy": 100142, "ModifiedDate": "2013-08-11T20:31:50", "Id": 101971, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "NOBL", "VesselName": "NORASIA BELLATRIX", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2013-08-19T00:00:43", "Id": 102021, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WORT", "VesselName": "WUGANG ORIENT", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-08-19T05:32:48", "ModifiedBy": 100181, "ModifiedDate": "2013-08-19T05:32:48", "Id": 102061, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "HNST", "VesselName": "HANDAN STEEL", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-08-22T22:15:46", "ModifiedBy": 100142, "ModifiedDate": "2013-08-22T22:15:46", "Id": 102111, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "HYNW", "VesselName": "HYUNDAI NEW YORK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-08-27T03:41:10", "ModifiedBy": 100142, "ModifiedDate": "2013-08-27T03:41:10", "Id": 102151, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "MAEU", "VesselName": "MAERSK EUBANK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-03T23:04:12", "ModifiedBy": 100142, "ModifiedDate": "2013-09-03T23:04:12", "Id": 102191, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CASK", "VesselName": "CAPE STORK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-16T22:25:38", "ModifiedBy": 100142, "ModifiedDate": "2013-09-16T22:25:38", "Id": 102331, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CHAW", "VesselName": "CAPE HAWK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-17T00:56:57", "ModifiedBy": 100142, "ModifiedDate": "2013-09-17T00:56:57", "Id": 102341, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "KEPA", "VesselName": "KENTON PARK", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-22T23:10:02", "ModifiedBy": 100142, "ModifiedDate": "2013-09-22T23:10:02", "Id": 102411, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "BGAT", "VesselName": "BRIDGEGATE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-09-23T23:45:08", "ModifiedBy": 100142, "ModifiedDate": "2013-09-23T23:45:08", "Id": 102441, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "HEYT", "VesselName": "HEYTHROP", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2013-10-09T01:42:48", "Id": 102541, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CANT", "VesselName": "CAP ARNAUTI", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2013-11-20T21:41:50", "ModifiedBy": 100142, "ModifiedDate": "2013-11-20T21:41:50", "Id": 102781, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WEGA", "VesselName": "WEST GATE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-12-01T22:57:36", "ModifiedBy": 100181, "ModifiedDate": "2013-12-01T22:57:36", "Id": 102821, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "SGGT", "VesselName": "SHAGANG GIANT", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2013-12-19T00:32:13", "ModifiedBy": 100181, "ModifiedDate": "2013-12-19T00:32:13", "Id": 102931, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CAEL", "VesselName": "CAPE EAGLE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100181, "CreatedDate": "2014-01-02T00:03:16", "ModifiedBy": 100181, "ModifiedDate": "2014-01-02T00:03:16", "Id": 103001, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "WASI", "VesselName": "WUGANG ASIA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-01-27T20:36:35", "ModifiedBy": 100142, "ModifiedDate": "2014-01-27T20:36:35", "Id": 103121, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "GFIR", "VesselName": "GUOFENG FIRST", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-01-31T23:38:15", "ModifiedBy": 100142, "ModifiedDate": "2014-01-31T23:38:15", "Id": 103141, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CPER", "VesselName": "CAPE PEREGRINE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-02-05T02:49:05", "ModifiedBy": 100142, "ModifiedDate": "2014-02-05T02:49:05", "Id": 103151, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "CELD", "VesselName": "CMA CGM ENFIELD", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-02-13T21:32:42", "ModifiedBy": 100142, "ModifiedDate": "2014-02-13T21:32:42", "Id": 103211, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "GRAY", "VesselName": "GREEN RAY ", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-04-09T22:53:41", "ModifiedBy": 100142, "ModifiedDate": "2014-04-09T22:53:41", "Id": 103461, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "NWAY", "VesselName": "NOBLEWAY", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-04-28T23:37:01", "ModifiedBy": 100142, "ModifiedDate": "2014-04-28T23:37:01", "Id": 103531, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "ASEA", "VesselName": "ANDAMAN SEA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-05-14T19:26:51", "ModifiedBy": 100142, "ModifiedDate": "2014-05-14T19:26:51", "Id": 103581, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "MBEL", "VesselName": "MSC BELLATRIX", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-04T20:16:13", "ModifiedBy": 100142, "ModifiedDate": "2014-06-04T20:16:13", "Id": 103751, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "THUG", "VesselName": "THURINGIA", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-18T18:52:09", "ModifiedBy": 100142, "ModifiedDate": "2014-06-18T18:52:09", "Id": 103791, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "PUSA", "VesselName": "PUSAN", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-18T23:35:10", "ModifiedBy": 100142, "ModifiedDate": "2014-06-18T23:35:10", "Id": 103801, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "OTOW", "VesselName": "OSAKA TOWER", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-26T19:18:25", "ModifiedBy": 100142, "ModifiedDate": "2014-06-26T19:18:25", "Id": 103881, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "RUND", "VesselName": "RUTLAND", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-06-27T16:58:49", "ModifiedBy": 100142, "ModifiedDate": "2014-06-27T16:58:49", "Id": 103891, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "NIGF", "VesselName": "NILEDUTCH GIRAFFE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-07-01T23:32:36", "ModifiedBy": 100142, "ModifiedDate": "2014-07-01T23:32:36", "Id": 103922, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "SFAI", "VesselName": "SHANGANG FAITH", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 0, "CreatedDate": null, "ModifiedBy": 100142, "ModifiedDate": "2014-07-10T19:15:33", "Id": 103971, "Rev": 3, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "INFR", "VesselName": "INDIAN FRIENDSHIP", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-07-15T20:12:08", "ModifiedBy": 100142, "ModifiedDate": "2014-07-15T20:12:08", "Id": 104001, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }, { "VesselCode": "DVGT", "VesselName": "DEVONGATE", "ClientId": 100131, "ClientName": "Eastern Pacific Shipping Pte Ltd", "CreatedBy": 100142, "CreatedDate": "2014-09-01T21:29:23", "ModifiedBy": 100142, "ModifiedDate": "2014-09-01T21:29:23", "Id": 104261, "Rev": 1, "IsPersisted": true, "Status": 1, "IsActive": true }];
        if (options.el) {
            scope = angular.element('#' + options.el).scope();
            if (data && options.responsePath)
                scope.model[options.responsePath] = data;
        }

        if (options['onComplete'])
            options['onComplete'](data, options, hasError);
    }
    /**
    * Destroy scope and leaky objects
    */
    $scope.$on('$destroy', function () {
        console.log('Destroy - $viewBuilderController' );
    });
}]);