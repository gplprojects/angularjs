Feature added in this version (v1.2)
====================================
1. Components
	1.1 Highcharts (highcharts-ng)

2. Functionalities
	2.1 before and after rendering callbacks
	2.2 Loaded external lib using requirejs
	2.3 Extended controller loader to load javascript partials
		Example:
		$ngViewLoader.load('<viewName>', 'viewController', '<viewControllerName>', <skipDynamicRendering>) or
		$ngViewLoader.load('<viewName>', ['viewController', 'partialController'], '<viewControllerName>', <skipDynamicRendering>)
	2.4 set panel static conent with in meta data (This will skip rendering children) 
	2.5 Moved button handler to base (app.js). Only prepareRequest and processResponse will be in view scope.

/****************************************************************************************************************************************************************/
List of open sources we use
===========================
1. AngularJs
	https://angularjs.org/
2. BootstrapJs
	http://getbootstrap.com/javascript/
3.Table 
	3.1 ngGrid
		http://angular-ui.github.io/ng-grid/
	3.2 SmartTable**
		http://lorenzofox3.github.io/smart-table-website/
4. Charts 
	4.1 Chart.js and Angles
		http://www.chartjs.org
		https://github.com/lgsilver/angles
	4.2 Highcharts and highcharts-ng
		http://www.highcharts.com/
		https://github.com/pablojim/highcharts-ng
5. Leaflet and angular--leaflet-directiv
	http://leafletjs.com/
	http://tombatossals.github.io/angular-leaflet-directive/
6. Bootstrap for Angular
	http://angular-ui.github.io/bootstrap/#/tabs

Note:
** Included in the project and not using