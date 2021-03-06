define(['dController', 'loginView', 'loginModel', Ancients.cssPath('user/css/login.css')], function(dController, loginView, loginModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new loginModel(this),
                view = new loginView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});