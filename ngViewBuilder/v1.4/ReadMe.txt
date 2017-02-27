Feature added in this version (v1.2)
====================================
1. Components
	1.1 Highcharts (highcharts-ng)
	1.2 TextArea
	1.3 Date field and inline date field

2. Functionalities
	2.1 Folder restructured - Keeping samples and frameworks inplace
	2.2 Read options from configurable object or $schema.options.<fieldname>
	2.3 Instant compiliation
	2.4 Placeholder added for Text, Select and Text area fields
	2.5 hideWhen - A expression support for all components
	2.6 Actions - Enhancemet
		<actionId>: { 
						name: '<actionName>' //Optional default: actionId
						type: 'get/post/put/delete/update',//default: get
						processingType: '<ajax/localstore/nav/(http/angular/$http)>', //default: angular  
						url: '<Relative or ABS Path>',  //default: '/api/<actionId>'
						onBefore: <func>, //default: $scope.doPrepareRequest(ops)
						onComplete: <func>, //default: $scope.doParseResponse(data, ops, hasError)
						requestPath: '<dataPath>',  //default: ''
						responsePath:'<dataPath>', //default: ''
						header: <JSON>, //defsault: null
						//default: null
						params: {
							paramKey {
								type: '<static/scope/model', //default: model,
								path: <dataPath> //model.<dataPath> or $scope.<dataPath>
								subpath: '' //get subpath values form parsed path value
							}
						},
						postAction: <ActionID> //default: '' - OnComplete of current action execute another action
					}
	2.7 Added UTC (Karma + Jasmine)
	2.8 Directive support and minor improvements
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
	http://angular-ui.github.io/bootstrap/

Note:
** Included in the project and not using