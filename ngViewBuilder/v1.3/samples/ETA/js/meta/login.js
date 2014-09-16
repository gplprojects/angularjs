ScreenMetaData = {
    metainfo: {
        view: 'login',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },

    actions: {
        login: { processingType: 'ajax', url: '//166.62.16.148/staging/mvc/api/security/authenticateuser', type: 'get', requestPath: 'loginform' }
    },

    panels: {
        container1: {
            attr: { class: 'container' },
            children: {
                row1: {
                    attr: { class: 'row' },
                    children: {
                        column0: {
                            attr: { class: 'span4 offset4' },
                            children: {
                                overview: {
                                    type: 'panel',
                                    children: {
                                        loginform: {
                                            type: 'form',
                                            children: {
                                                loginname: {
                                                    type: 'text',
                                                    label: 'Username'
                                                },
                                                loginpassword: {
                                                    type: 'password',
                                                    template: 'text',
                                                    label: 'Password'
                                                },
                                                button1: {
                                                    type: 'button',
                                                    label: 'Login',
                                                    attr: { class: 'pull-right', style: "margin-right: 15px;" },
                                                    actions:['login']
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
}