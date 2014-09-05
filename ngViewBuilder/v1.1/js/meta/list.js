ScreenMetaData = {
    view: 'list',
    metainfo: { view: 'list',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },

    options: {
        'gender': [{ key: 'M', value: 'Male' }, { key: 'F', value: 'Female' }],
        'work': [{ key: 'W1', value: 'Work1' }, { key: 'W2', value: 'Work2' }, { key: 'W3', value: 'Work3' }]
    },

    panels: {
        row1: {
            attr: { class: 'row' },
            children: {
                column0: {
                    attr: { class: 'col-md-6 well' },
                    children: {
                        panel0: {
                            type: 'panel',
                            title: 'Grid using ngGrid',
                            children: {
                                grid: {
                                    type: 'gridpanel',
                                    template: 'ng-grid',
                                    controltype: 'ng-grid',
                                    config: {
                                        columnDefs: [
                                            { field: 'name', displayName: 'Name' },
                                            { field: 'age', displayName: 'Age' }
                                        ],
                                        enableCellSelection: true,
                                        enableRowSelection: false,
                                        enableCellEdit: true
                                    }
                                }
                            }
                        },
                        panel1: {
                            type: 'panel',
                            title: 'Chart using Chart.js (Angles)',
                            children: {
                                samplechart1: {
                                    type: 'chartpanel',
                                    controltype: 'chatjs',
                                    template: 'chartjs',
                                    model: 'samplechart',
                                    config: {
                                        type: 'Doughnut'
                                    }
                                }
                            }
                        },
                        panel2: {
                            type: 'panel',
                            title: 'Map using LeafletJs (angular-leaflet-directive)',
                            children: {
                                samplemap: {
                                    type: 'mappanel',
                                    controltype: 'leaflet',
                                    template: 'leaflet',
                                    config: {
                                        osloCenter: {
                                            lat: 59.91,
                                            lng: 10.75,
                                            zoom: 12
                                        },
                                        markers: {
                                            osloMarker: {
                                                lat: 59.91,
                                                lng: 10.75,
                                                message: "I want to travel here!",
                                                focus: true,
                                                draggable: false
                                            }
                                        },
                                        defaults: {
                                            scrollWheelZoom: false
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                column1: {
                    attr:{class:'col-md-6'},
                    children: {
                        panel3: {
                            type: 'panel',
                            title: 'Form Panel',
                            children: {
                                generalinfo: {
                                    type: 'form',
                                    children: {
                                        name: {
                                            type: 'text',
                                            label: 'Person Name',
                                            help: 'Legal name should be entered here',
                                            model: 'firstname',
                                        },
                                        age: {
                                            type: 'number',
                                            label: 'Age',
                                            help: 'Age',
                                            model: 'age'
                                        },
                                        gender: {
                                            type: 'select',
                                            label: 'Gender',
                                            help: 'Gender',
                                        },
                                        work: {
                                            type: 'select',
                                            label: 'Work',
                                            help: 'works',
                                        },
                                        button1: {
                                            type: 'button',
                                            label: 'Submit',
                                            handle: 'handleUIEvents',
                                            attr: {class: 'pull-right', style: "margin-right: 15px;"},
                                            actions: {
                                                save: { params: '', type: 'post', takeOnlyDirty: false, requestPath: '', responsePath: '', isFilling: false },
                                                fetch: { params: '', type: 'get', requestPath: '', responsePath: '', isFilling: false }
                                            }
                                        }
                                    }
                                } //End of Gen Info
                            }
                        },
                        tabpannel1: {
                            type: 'tabpanel',
                            config: {
                                tabs: [{
                                        id: 'tab-1',
                                        title: 'Static Content',
                                        active: true,
                                        content: 'Text / HTML markup goes here' //type: 'static'
                                    },
                                    {
                                        id: 'tab-2',
                                        title: 'User defined TemplateURL',
                                        contentURL: 'mytemplate.html', //type: 'dynamic' / 'template'
                                    },
                                    {
                                        id: 'tab-3',
                                        title: 'Default TemplateURL', //type: 'dynamic' / 'template'
                                        children: {
                                            _name: {
                                                type: 'text',
                                                label: '_Person Name',
                                                help: 'Legal name should be entered here',
                                                model: 'firstname',
                                            }
                                        }
                                    }]
                            }
                        }
                    }
                }
            }
        }
    }
}