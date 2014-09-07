ScreenMetaData = {
    view: 'tracker',
    metainfo: { view: 'tracker',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },

    panels: {
        row1: {
            attr: { class: 'row' },
            children: {
                column0: {
                    attr: { class: 'col-md-6' },
                    children: {
                        overview: {
                            type: 'panel',
                            title: 'Overview',
                            children: {
                            }
                        }
                    }
                },
                column1: {
                    attr:{class:'col-md-6'},
                    children: {
                        chartpanel1: {
                            type: 'panel',
                            title: 'Highcharts',
                            children: {
                                highchart1: {
                                    type: 'chartpanel',
                                    controltype: 'highchart',
                                    template: 'highchart',
                                    model: 'samplechart',
                                    config: {
                                        "options": {
                                            "chart": {
                                                "type": "areaspline"
                                            },
                                            "plotOptions": {
                                                "series": {
                                                    "stacking": ""
                                                }
                                            }
                                        },
                                        "series": [],
                                        "title": {
                                            "text": "Categories"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}