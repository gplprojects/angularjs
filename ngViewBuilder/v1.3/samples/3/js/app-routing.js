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
    $urlRouterProvider.otherwise('/login');
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
        }).state('home.master1', {
            url: '/master1',
            template: viewTemplate.replace(/{{view}}/g, 'master1'),
            controller: 'master1Controller',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('master1', '../js/controllers/master1', 'master1Controller', false);
                }]
            }
        }).state('home.master2', {
            url: '/master2',
            template: viewTemplate.replace(/{{view}}/g, 'master2'),
            controller: 'master2Controller',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('master2', '../js/controllers/master2', 'master2Controller', true);
                }]
            }
        }).state('home.master3', {
            url: '/master3',
            template: viewTemplate.replace(/{{view}}/g, 'master3'),
            controller: 'master3Controller',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('master3', '../js/controllers/master3', 'master3Controller', true);
                }]
            }
        });
}]);
