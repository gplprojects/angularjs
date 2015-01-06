/**
 * Configure application routing to takecare of navigation
 **/
window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    //Default template
    var viewTemplate = '<div id="screen-{{view}}" name="screen-{{view}}"><p class="text-center progress"><span class="label label-info">Please wait, I am building view...</span></p></div>';

    /**
	 * Read more on http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	 **/
    //Used for ui-view (Nested views)
    $urlRouterProvider.otherwise('/dashboards');
    $stateProvider
        .state('dashboards', {
            url: '/dashboards',
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('dashboard', '../js/controllers/dashboard', 'dashboardController', true);
                }]
            }
        })
        .state('dashboards.overview', {
            url: '/overview',
            template: viewTemplate.replace(/{{view}}/g, 'overview'), //templateUrl: 'views/overview.html',
            controller: 'overviewController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('overview', '../js/controllers/overview', 'overviewController', false);
                }]
            }
        })
        .state('dashboards.ap_dashboard', {
            url: '/ap_dashboard',
            templateUrl: 'views/add.html',
            controller: 'addController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('add', '../js/controllers/add', 'addController', false);
                }]
            }
        });
}]);
