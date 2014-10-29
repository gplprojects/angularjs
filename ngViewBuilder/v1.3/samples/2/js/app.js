
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
                                           'ui.grid',
                                           'angles',
                                           'leaflet-directive',
                                           'ui.bootstrap',
                                           'highcharts-ng'
]);
