////////////// Dummy file to make requireJs work ///////////////////////
requirejs.config({
    paths: {
        /* Required libs */
        'angular': '../lib/angular/angular',
        'angular-ui.router': '../lib/angular/angular-ui-router',
        'ng-view-builder': '../lib/ngViewBuilder/ngViewBuilder',
        'ui.bootstrap': '../lib/bootstrap/angular-ui/ui-bootstrap-tpls-0.11.0.min',
        
        /* Optional libs */
        'ng-gird': '../lib/grid/nggrid/ng-grid.debug',
        'ng-gird-layout': '../lib/grid/nggrid/ng-grid-layout',
        'chartjs': '../lib/charts/chartjs/chart',
        'angles': '../lib/charts/chartjs/angles',
        'higncharts-all': '../lib/charts/highcharts/highcharts-all',
        'highcharts-ng': '../lib/charts/highcharts/highcharts-ng',
        'leaflet': '../lib/map/leaflet/leaflet',
        'angular-leaflet-directive': '../lib/map/leaflet/angular-leaflet-directive.min',
        
        /*App Files*/
        'app': 'app',
        'app-routing': 'app-routing'
    },

    shim: {
        'angular-ui.router': { deps: ['angular'] },
        'angles': { deps: ['chartjs'] },
        'angular-leaflet-directive': {deps: ['leaflet']},
        'app': { deps: ['angular-ui.router', 'ng-view-builder', 'ui.bootstrap', 'ng-gird', 'ng-gird-layout', 'angles', 'higncharts-all', 'highcharts-ng', 'angular-leaflet-directive'] },
        'app-routing': { deps: ['app'] },
    }
});

require(["app-routing"], function () {
    
    angular.bootstrap(document, [window.appName]);

});