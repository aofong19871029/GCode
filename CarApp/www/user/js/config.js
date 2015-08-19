require.config({
    baseUrl: 'js',
    waitSeconds: 20,
    paths: {
        'loginView': 'view/loginview',
        'loginModel': 'model/loginmodel',
        'signupView': 'view/signupview',
        'signupModel': 'model/signupmodel',
        'signupdoneView': 'view/signupdoneview',
        'signupdoneModel': 'model/signupdonemodel',
        'realnameView': 'view/realnameview',
        'realnameModel': 'model/realnamemodel'
    }
});

Ancients.config({
    serviceDir: 'http://10.32.148.1/restful/'
});