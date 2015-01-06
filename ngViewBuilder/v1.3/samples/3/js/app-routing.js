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
    $urlRouterProvider.otherwise('/list');
    $stateProvider
        .state('login', {
            url: '/login',
            template: '<ng-view-build schema="js/meta/login.js" view="login" async="false" replace="true"></ng-view-build>', 
            controller: 'loginController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('login', '../js/controllers/login', 'loginController', true);
                }]
            }
        })
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'homeController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('home', '../js/controllers/home', 'homeController', true);
                }]
            }
        }).state('home.list', {
            url: '/list',
            templateUrl: 'views/list.html',
            controller: 'listController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('list', '../js/controllers/list', 'listController', true);
                }]
            }
        }).state('home.detail', {
            url: '/detail',
            templateUrl: 'views/detail.html',
            controller: 'detailController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('detail', '../js/controllers/detail', 'detailController', true);
                }]
            }
        });
}]);
