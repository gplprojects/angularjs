ScreenMetaData = {
    view: 'overview',
    metainfo: {
        view: 'overview',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },

    panels: {
        row1: {
            attr: { class: 'row' },
            children: {
                column0: {
                    attr: { class: 'col-md-12 well' },
                    children: {
                        panel1: {
                            type: 'panel',
                            title: 'Expenses by Category',
                            children: {
                                samplechart1: {
                                    type: 'chartpanel',
                                    controltype: 'chatjs',
                                    template: 'chartjs',
                                    model: 'category',
                                    config: {
                                        type: 'Pie'
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