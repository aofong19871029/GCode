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
    dir: 'http://localhost:8080/',
    serviceDir: 'http://localhost/restful/'
});