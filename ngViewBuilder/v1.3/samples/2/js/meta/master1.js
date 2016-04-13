ScreenMetaData = {
    metainfo: {
        view: 'master1',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },

    actions: {
        init1: { isInit: true, processingType: 'ajax', url: '//127.0.0.1/staging/mvc/api/clientmaster/GetClientMasters', type: 'get', responsePath: 'Clients' },
        search1: { processingType: 'ajax', url: '//127.0.0.1/staging/mvc/api/vesselmaster/GetVesselMastersByFilter', params: { searchText: { path: 'vessel', type: 'model' }, clientId: { path: 'client', subpath:'Id', type: 'model' } }, type: 'get', responsePath: 'Vessels' }
    },

    panels: {
        row1: {
            attr: { class: 'row', style: 'margin: 20px;' },
            children: {
                column0: {
                    attr: { class: 'col-md-4' },
                    children: {
                            vessel: {
                                type: 'text',
                                label: 'Name'
                            }
                        }
                },
                column1: {
                    attr: { class: 'col-md-4' },
                    children: {
                        client: {
                            type: 'select',
                            label: 'Client',
                            optionsKey: 'model.Clients',
                            optionKey: 'ClientCode',
                            optionValue: 'ClientName'
                        }
                    }
                },
                column2: {
                    attr: { class: 'col-md-2' },
                    children: {
                        button1: {
                            type: 'button',
                            label: 'Search',
                            attr: { class: 'pull-right', style: "margin-right: 15px;" },
                            actions: ['search1']
                        }
                    }
                }
            }
        },

        row2: {
            attr: { class: 'row' },
            children: {
                    column0: {
                    attr: { class: 'col-md12', style:'margin: 20px;' },
                    children: {
                                grid1: {
                                    type: 'gridpanel',
                                    template: 'ui-grid',
                                    controltype: 'ui-grid',
                                    model:'Vessels',
                                    config: {
                                        columnDefs: [
                                            { id: "VesselCode", displayName: "Vessel Code", field: "VesselCode" },
	                                        { id: "VesselName", displayName: "Vessel Name", field: "VesselName" },
	                                        { id: "ClientId", displayName: "Client Name", field: "ClientId", enableCellEditOnFocus: true, editableCellTemplate: "<select ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-model=\"COL_FIELD\"> <option ng-repeat=\"client in model.Clients\" value=\"{{client.ClientCode}}\">{{client.ClientName}}</option></select>" } //'<select ng-class=\"colt\" + col.index\" ng-model="id"></select>' }
                                        ],
                                        enableCellSelection: true,
                                        enableRowSelection: false,
                                        enableCellEdit: true
                                    },
                                    attr:{style:'min-height:500px;'}
                            }
                    }
                }
            }
        }
    }
}
