angular.module('ngShapes', [])

//directive
.directive('circle', ['$window', function($window) {
    var base = {
            restrict: "E",
            replace: true,
            transclude: true,
            scope:{
                config: "=",
                id: '@'
            },
            template:   "<div class='shapes' ng-class='{active:active.enableAll}'>"+
                            "<div id='{{_id}}_title' class='title'> <h1 ng-bind='title'> </h1> </div>"+
                            "<div id='{{_id}}_nodata' class='nodata' ng-if='data.length == 0 && config.noDataText' ng-bind-html='config.noDataText'></div>"+
                            "<div id='{{_id}}_master' ng-if='data.length'> <div id='{{_id}}_master_circle' class='circle master' ng-click='eventHandler(1, $event)' ><div id='{{_id}}_master_txt' class='text' ng-bind-html='data[0].text'></div></div> </div>"+
                            "<div id='{{_id}}_slave_1' ng-if='data.length'> <div id='{{_id}}_slave_1_circle' class='circle slave slaveone'   ng-click='eventHandler(2, $event)' style='display:none;' ng-style='style[0]'><div id='{{_id}}_slave_1_inner_txt' ng-if='active.enableAll' class='text' ng-bind='data[1].percentage'></div></div> <div id='{{_id}}_slave_1_legend_txt' ng-if='active.enableAll' ng-style='legendStyle[0]' class='legend' ng-bind='data[1].text'/> </div>"+
                            "<div id='{{_id}}_slave_2' ng-if='data.length'> <div id='{{_id}}_slave_2_circle' class='circle slave slavetwo'   ng-click='eventHandler(3, $event)' style='display:none;' ng-style='style[1]'><div id='{{_id}}_slave_2_inner_txt' ng-if='active.enableAll' class='text' ng-bind='data[2].percentage'></div></div> <div id='{{_id}}_slave_2_legend_txt' ng-if='active.enableAll' ng-style='legendStyle[1]' class='legend' ng-bind='data[2].text'/> </div>"+
                            "<div id='{{_id}}_slave_3' ng-if='data.length'> <div id='{{_id}}_slave_3_circle' class='circle slave slavethree' ng-click='eventHandler(4, $event)' style='display:none;' ng-style='style[2]'><div id='{{_id}}_slave_3_inner_txt' ng-if='active.enableAll' class='text' ng-bind='data[3].percentage'></div></div> <div id='{{_id}}_slave_3_legend_txt' ng-if='active.enableAll' ng-style='legendStyle[2]' class='legend' ng-bind='data[3].text'/> </div>"+
                            "<div id='{{_id}}_slave_4' ng-if='data.length'> <div id='{{_id}}_slave_4_circle' class='circle slave slavefour'  ng-click='eventHandler(5, $event)' style='display:none;' ng-style='style[3]'><div id='{{_id}}_slave_4_inner_txt' ng-if='active.enableAll' class='text' ng-bind='data[4].percentage'></div></div> <div id='{{_id}}_slave_4_legend_txt' ng-if='active.enableAll' ng-style='legendStyle[3]' class='legend' ng-bind='data[4].text'/> </div>"+
                            "<div id='{{_id}}_slave_5' ng-if='data.length'> <div id='{{_id}}_slave_5_circle' class='circle slave slavefive'  ng-click='eventHandler(6, $event)' style='display:none;' ng-style='style[4]'><div id='{{_id}}_slave_5_inner_txt' ng-if='active.enableAll' class='text' ng-bind='data[5].percentage'></div></div> <div id='{{_id}}_slave_5_legend_txt' ng-if='active.enableAll' ng-style='legendStyle[4]' class='legend' ng-bind='data[5].text'/> </div>"+
                        "</div>",
        
        link: function(scope, element){
            
            if(!scope.config) scope.config = {}
            
            if(!scope.id || scope.id =='_wrapper') {
                if(scope.config.title)
                    scope._id = scope.config.title.toLowerCase();
                else
                    scope._id = "circle_" + new Date().getTime();
            }
            scope._id = (scope._id || scope.id).replace(/ /gi, "_");

            scope.title = scope.config.title || " ";
            scope.data = [];
            scope.config.noDataText = "No data to display";
            
            //styles
            scope.style =   [   {height: 100 * 0.70, width: 100 *0.70, top: 60, left: 15, display:''},
                                {height: 100 * 0.60, width: 100 *0.60, top: -25, left: 95, display:''},    
                                {height: 100 * 0.50, width: 100 *0.50, top: -135, left: 125, display:''}, 
                                {height: 100 * 0.35, width: 100 *0.35, top: -223, left: 122, display:''},    
                                {height: 100 * 0.30, width: 100 *0.30, top: -280, left: 90, display:''}
                            ];   

            scope.legendStyle =   [   
                                { top: 230, left: 110},
                                { top: 190, left: 182},    
                                { top: 138, left: 202}, 
                                { top: 93, left: 185},    
                                { top: 60, left: 150}
                            ];

            scope.dataWatcher = scope.$watch('config.data', function(newVal, oldVal) {
                                                                                            if (newVal && !newVal.floater) {
                                                                                                scope.parseData();
                                                                                            }
                                                                                        });
            
            scope.floaterWatcher = scope.$watch('config.data.floater', function(newVal, oldVal) {
                                                                                            if (newVal) {
                                                                                                scope.parseData();
                                                                                            }
                                                                                        });

            scope.parseData = function() {
                
                if(!scope.config.data)
                    return;

                if(scope.config.data.floater) {
                    scope.rawData = scope.config.data.floater
                }
                else {
                    scope.rawData = scope.config.data;
                }

                scope.data = [];
                //sort
                if(scope.rawData && scope.rawData.sort) {          
                    var sortedData = scope.rawData.sort(function(a, b){return b.data - a.data});
                    scope.rawData = sortedData;
                }
                
                //data
                if(!scope.rawData || !scope.rawData.length)
                    return;

                scope.data.push({
                                    text:scope.rawData[0].name + " <br/> " + scope.rawData[0].percentUsage, 
                                    usage: scope.rawData[0].data, 
                                    percentage: scope.rawData[0].percentUsage
                                });
                
                for (var i = 1; i < scope.rawData.length; i++) {
                    scope.data.push({
                                        text:scope.rawData[i].name, 
                                        usage: scope.rawData[i].data, 
                                        percentage: scope.rawData[i].percentUsage
                                    });
                }
            };

            scope.eventHandler = function(type, event) {
                 if(!scope.rawData)
                    return;
                
                scope.active = {
                                    enableAll : true,
                                    clickedOn : new Date().getTime()
                                }
                event.preventDefault()
            };
	
	    //to do: listen document click event
            scope.$on('userHasClicked', function (event) {
                if(scope.active) {
                    if( ((new Date()).getTime() - scope.active.clickedOn) > 500) {
                        delete scope.active;     
                    }
                }
            });
        }                 
    }

    return base;
}]);
