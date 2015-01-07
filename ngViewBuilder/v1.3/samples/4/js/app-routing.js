//Default template
var viewTemplate = '<div id="screen-{{view}}" name="screen-{{view}}"><p class="text-center progress"><span class="label label-info">Please wait, I am building view...</span></p></div>';


/**
 * Configure application routing to takecare of navigation
 **/
window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    
    /**
	 * Read more on http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	 **/
    //Used for ui-view (Nested views)
    $urlRouterProvider.otherwise('/' + appName);

    $stateProvider.state(appName, {
        url: '/' + appName,
        templateUrl: 'views/dashboard.html',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load(appName, '', '', true);
            }]
        }
    });
}]);

window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state(appName + '.create', {
        url: '/create',
        templateUrl: 'views/create.html',
        controller: 'createController',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load('create', '../js/controllers/create', 'createController', true);
            }]
        }
    });
}]);

window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state(appName + '.overview', {
        url: '/overview',
        template: viewTemplate.replace(/{{view}}/g, 'overview'), //templateUrl: 'views/overview.html',
        controller: 'defaultController',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load('overview', '../js/controllers/default', 'defaultController', false);
            }]
        }
    });
}]);

window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('dashboards.ap_dashboard', {
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
