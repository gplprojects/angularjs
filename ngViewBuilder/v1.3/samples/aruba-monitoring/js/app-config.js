/**
 * Application configuration
 * Define your appname and will be used as you app. Note: Any changes you do here will have impact on your app, so please do change in ng-app attribute to make your app run soomthly.
 * Relative library files path from this location
 */
window.appName = "aruba-monitoring";
window.appPath = {
                    base: '',
                    host: location.host,
                    protocol: location.protocol,
                    origin: location.origin,
                    fw: '../../../',
                    lib: '../../../lib/',
                    tpl: 'templates/'
                };

window.supportedControls = [
    {
        desc: 'Table',
        basetype: 'gridpanel',
        controltype: 'gridpanel',
        template: 'ui-grid',
    },
    
    {
        desc: 'Chart',
        basetype: 'chartpanel',
        controltype: 'highchart',
        template: 'highchart'
    },
    {
        desc: 'Map',
        basetype: 'mappanel',
        controltype: 'leaflet',
        template: 'leaflet',
    },
    {
        desc: 'Box (Counters)',
        basetype: 'panel',
        controltype: 'panel',
        template: 'box',
    }
];
/**
 * requirejs - configuration
 * Load all dependented javascript files using requirejs.. Angular and Bootstrap are included in index.html
 */
requirejs.config({
    paths: {
        /* Required libs */
        'angular': window.appPath.lib + 'angular/angular',
        'angular-ui.router': window.appPath.lib + 'angular/angular-ui-router',
        'ng-view-builder': window.appPath.lib + 'ngViewBuilder/ngViewBuilder',
//        'ui.bootstrap': window.appPath.lib + 'bootstrap/angular-ui/ui-bootstrap-tpls-0.11.0.min',

        /* Optional libs */
        'ng-gird': window.appPath.lib + 'grid/nggrid/ng-grid.debug',
        'ng-gird-layout': window.appPath.lib + 'grid/nggrid/ng-grid-layout',
        'ui-gird': window.appPath.lib + 'grid/uigrid/ui-grid',
        'chartjs': window.appPath.lib + 'charts/chartjs/chart',
        'angles': window.appPath.lib + 'charts/chartjs/angles',
        'higncharts-all': window.appPath.lib + 'charts/highcharts/highcharts-all',
        'highcharts-ng': window.appPath.lib + 'charts/highcharts/highcharts-ng',
        'leaflet': window.appPath.lib + 'map/leaflet/leaflet',
        'angular-leaflet-directive': window.appPath.lib + 'map/leaflet/angular-leaflet-directive.min',

        /*App Files*/
        'app': 'app',
        'app-routing': 'app-routing'
    },

    shim: {
        'angular-ui.router': { deps: ['angular'] },
        'angles': { deps: ['chartjs'] },
        'angular-leaflet-directive': { deps: ['leaflet'] },
        'app': { deps: ['angular-ui.router', 'ng-view-builder', 'ng-gird', 'ng-gird-layout', 'ui-gird', 'angles', 'higncharts-all', 'highcharts-ng', 'angular-leaflet-directive'] },
        'app-routing': { deps: ['app'] },
    }
});

require(["app-routing"], function () {

    //bootstrap angular, since we don't use angular directive 'ng-app="<window.appName>"'
    angular.bootstrap(document, [window.appName]);

});