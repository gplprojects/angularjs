/**
 * Configure application routing to takecare of navigation
 **/
window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    //Default template
    var viewTemplate = '<div id="screen-{{view}}" name="screen-{{view}}"><p class="text-center progress"><span class="label label-info">Please wait, I am building view...</span></p></div>';

    /**
	 * Read more on http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	 **/
    $urlRouterProvider.otherwise('/overview');
    $stateProvider
        .state('overview', {
            url: '/overview',
            template: viewTemplate.replace(/{{view}}/g, 'overview'),
            controller: 'overviewController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('overview', '../js/controllers/overview', 'overviewController', false);
                }]
            }
        })
		.state('tracker', {
		    url: '/tracker',
		    template: viewTemplate.replace(/{{view}}/g, 'tracker'),
		    controller: 'trackerController',
		    resolve: {
		        load: ['$ngViewLoader', function ($ngViewLoader) {
		            return $ngViewLoader.load('tracker', '../js/controllers/tracker', 'trackerController', false);
		        }]
		    }
		});
}]);
