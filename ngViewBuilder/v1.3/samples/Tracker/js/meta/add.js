ScreenMetaData = {
    view: 'add',
    metainfo: { view: 'add',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },

    panels: {
        row1: {
            attr: { class: 'row' },
            children: {
                column0: {
                    attr: { class: 'col-md-12' },
                    children: {
                        overview: {
                            type: 'panel',
                            title: 'Add Expense',
                            children: {
                                expenseform: {
                                    type: 'form',
                                    children: {
                                        category: {
                                            type: 'select',
                                            label: 'Category',
                                            optionsKey: 'model.categories',
                                            optionKey : 'id',
                                            optionValue: 'desc'
                                        },
                                        newcategory: {
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Please choose category or create new',
                                            hideWhen: "model.expenseform.category && model.expenseform.category.id"
                                        },
                                        amount: {
                                            type: 'number',
                                            label: 'Amount',
                                            placeholder: 'Input amount'
                                        },
                                        on: {
                                            type: 'date',
                                            label: 'Date',
                                            config: {
                                                format: 'dd/MM/yyyy',
                                                dateOptions: {
                                                    formatYear: 'yy'
                                                },
                                                closeText: 'Close'
                                            },
                                            placeholder: 'Choose date'
                                        },
                                        notes: {
                                            type: 'textarea',
                                            label: 'Notes',
                                            placeholder: 'Input the amount spent on this category'
                                        },
                                        button1: {
                                            type: 'button',
                                            label: 'Save',
                                            handle: 'handleUIEvents',
                                            attr: { class: 'pull-right', style: "margin-right: 15px;" },
                                            actions: {
                                                save: { params: '', type: 'post', takeOnlyDirty: false, requestPath: '', responsePath: '', isFilling: false }
                                            }
                                        },
                                        button2: {
                                            type: 'button',
                                            label: 'Back',
                                            handle: 'handleUIEvents',
                                            attr: { class: 'pull-right', style: "margin-right: 15px;" },
                                            actions: {
                                                back: { params: '', processingType: 'nav', path: '#/tracker', onBefore: function () { return true;} }
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
}