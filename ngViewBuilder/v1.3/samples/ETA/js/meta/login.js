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
            attr: { class: 'container', style:'margin-top:10%;' },
            children: {
                loginform: {
                        type: 'form',
                        attr: { class: 'form-horizontal', style:'max-width:350PX; margin: 0 auto;' },
                        children: {
                            loginname: {
                                cls:'col-sm-9',
                                type: 'text',
                                label: 'Username'
                            },
                            loginpassword: {
                                cls: 'col-sm-9',
                                type: 'password',
                                template: 'text',
                                label: 'Password'
                            },
                            button1: {
                                type: 'button',
                                label: 'Login',
                                attr: { class: 'pull-right' },
                                actions:['login']
                            }
                        }
                    }
                }
            }
        }
}