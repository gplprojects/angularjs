/**
 * A Template based Angular view builder module
 */
angular.module('ngViewBuilder', [])

/**
 * Preload required templates 
 */
.run(['$q', '$ngViewUtility', function ($q, $ngViewUtility) {

    $q.all([
        $ngViewUtility.getTemplateByType('form'),
        $ngViewUtility.getTemplateByType('panel'),
        $ngViewUtility.getTemplateByType('button'),
        $ngViewUtility.getTemplateByType('text'),
        $ngViewUtility.getTemplateByType('select'),
        $ngViewUtility.getTemplateByType('checkbox'),
        $ngViewUtility.getTemplateByType('radio'),
        $ngViewUtility.getTemplateByType('ng-grid'),
        $ngViewUtility.getTemplateByType('chartjs'),
        $ngViewUtility.getTemplateByType('highchart'),
        $ngViewUtility.getTemplateByType('leaflet'),
        $ngViewUtility.getTemplateByType('tabpanel')
    ]).then(function (data) {
        //I am done!
    });
}])

/**
* Utility Service
*/
.service('$ngViewUtility', ['$rootScope', '$templateCache', '$http', '$q', '$log', function ($rootScope, $templateCache, $http, $q, $log) {
    this.getTemplateByType = function(tmplateName) {
        var deferred = $q.defer();
        $http({
            url: (tmplateName.indexOf("/") != -1 ?  '' : 'lib/ngViewBuilder/tpl/') + tmplateName + '.html',
            method: "GET"
        }).success(function (content) {
            $templateCache.put(tmplateName, content)
            deferred.resolve();
        }).error(function () {
            $log.warn('ngViewBuilder - Run: Failed load template ' + tmplateName + '.html');
            deferred.resolve();
        });
        return deferred.promise;
    };

    this.getTemplateFromCache = function (tmplateName) {
        return $templateCache.get(tmplateName);
    };

    this.getDefaultConfig = function(controlType) {

        switch(controlType){
            case "ng-gid":
                break;
            
            /*case "highcharts":
            case "highchart":
                return {
                    "options": {
                        "chart": {
                            "type": "areaspline"
                        },
                        "plotOptions": {
                            "series": {
                                "stacking": ""
                            }
                        }
                    },
                    "series": [
                      {
                          "name": "Some data",
                          "data": [
                            1,
                            2,
                            4,
                            7,
                            3
                          ],
                          "id": "series-0",
                          "type": "column"
                      }
                    ],
                    "title": {
                        "text": "Hello"
                    },
                    "credits": {
                        "enabled": true
                    },
                    "loading": false
                };*/
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
                    if (skipRendering === true)
                        return;
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

        scope.$schema.$metainfo = scope.schema.$metainfo || { view: scope.schema.view};

        var rootEl = angular.element(document.querySelector('#screen-' + scope.$schema.$metainfo.view));
        
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
            case "time":
            case "select":
            case "multiselect":
            case "checkbox":
            case "radio":
            case "button":
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
    function buildPanel(scope, control, key, parentEl, dataPath, isCallback, model, isCallback) {

        var template = control.content || '<div id="{{id}}" name="{{name}}"></div>';

        if (!control.content && (control.template || control.type)) {
            template = $ngViewUtility.getTemplateFromCache(control.template || control.type);
            if (!template) {
                if (!isCallback) {
                    $ngViewUtility.getTemplateByType(control.template || control.type).then(function () {
                        buildPanel(scope, control, key, parentEl, dataPath, true);
                    });
                    return;
                }
                else {
                    template = '<div id="{{id}}" name="{{name}}"></div>';
                }
            }
        }

        control.dataPath = dataPath || control.name;
        control.showTitle = (control.showTitle || control.title || control.label) ? true : false;
        if (!scope.$temp[control.name])
            scope.$temp[control.name] = {};

        var defaultConfig = $ngViewUtility.getDefaultConfig(control.controltype);
        switch(control.type) {
            case "gridpanel":
                    
                    if (!scope.$schema.config[control.name].data)
                        scope.$schema.config[control.name].data = ("model." + (dataPath ? dataPath + "." + (control.model || control.name) : (control.model || control.name)))

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
                            var tabContentPanel = angular.element("<div></div>");
                            angular.forEach(tab.children, function (tabChild, tabChildName) {
                                buildControlByType(scope, tabChild, tabChildName, tabContentPanel, dataPath, model);
                            });
                            $templateCache.put(tab.id + ".html", tabContentPanel.html());
                            delete tabContentPanel;
                        }
                    });
                }
                break;
        }

        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var panelEl = angular.element($interpolate(template)(control));

        addAttributes(control, (panelEl.attr('id') !== control.id ? angular.element('#' + control.id, panelEl) : panelEl));

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, panelEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        if (!control.content && control.children) {
            angular.forEach(control.children, function (childObject, childName) {
                buildControlByType(scope, childObject, childName, (panelEl.attr('id') !== control.id ? angular.element('#' + control.id, panelEl) : panelEl), dataPath, model);
            });
        }

        parentEl.append(panelEl);
    }

    /**
     * Build form panel
     */
    function buildFormPanel(scope, control, key, parentEl, dataPath, isCallback, model) {

        var template = $ngViewUtility.getTemplateFromCache(control.template || control.type);
        if (!template) {
            if (!isCallback && false) {
                $ngViewUtility.getTemplateByType(control.template || control.type).then(function () {
                    buildFormPanel(scope, control, key, parentEl, dataPath, true);
                });
                return;
            }
            else {
                template = '<form id="{{id}}" name="{{name}}"></form>';
            }
        }

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

            case "checkbox":
            case "radio":
                control.hasOptions = scope.$schema.options[control.name] ? true : false;
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
        if (!template) {
            if (!isCallback) {
                $ngViewUtility.getTemplateByType(templateType).then(function () {
                    buildFormElement(scope, control, key, parentEl, dataPath, true);
                });
                return;
            }
            else {
                template = "<p> Template '" + templateType + ".html' not found!<p>"
            }
        }

        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var fieldEl = $interpolate(template)(control);

        parentEl.append(fieldEl);
        addAttributes(control, angular.element('#' + control.id, parentEl));

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, fieldEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);
        return;
    }
}]);
