define(['dController', 'loginView', 'loginModel'], function(dController, loginView, loginModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new loginModel(this),
                view = new loginView(model, this);

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});