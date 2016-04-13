ScreenMetaData = {
    metainfo: {
        view: 'master2',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
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
                            actions: {
                                save: { processingType:'ajax', url: '//127.0.0.1/staging/mvc/api/clientmaster/GetClientMasters', params: '', type: 'get', takeOnlyDirty: false, responsePath: 'Vessels' }
                            }
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
                                    template: 'ng-grid',
                                    controltype: 'ng-grid',
                                    model:'Vessels',
                                    config: {
                                        columnDefs: [
                                            { id: "VesselCode", displayName: "Vessel Code", field: "VesselCode" },
	                                        { id: "VesselName", displayName: "Vessel Name", field: "VesselName" },
	                                        { id: "ClientId", displayName: "Client Name", field: "ClientId", enableCellEditOnFocus: true, editableCellTemplate: "<select ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-model=\"COL_FIELD\"> <option ng-repeat=\"client in model.Clients\" value=\"{{client.ClientCode}}\">{{client.ClientName}}</option></select>" } //'<select ng-class=\"colt\" + col.index\" ng-model="ClientId"></select>' }
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
