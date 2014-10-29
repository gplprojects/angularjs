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
    $urlRouterProvider.otherwise('/tracker');
    $stateProvider
        .state('tracker', {
            url: '/tracker',
            templateUrl: 'views/overview.html',
            controller: 'trackerController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('tracker', '../js/controllers/tracker', 'trackerController', false);
                }]
            }
        })
        .state('add', {
            url: '/add',
            templateUrl: 'views/add.html',
            controller: 'addController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('add', '../js/controllers/add', 'addController', false);
                }]
            }
        });
}]);
